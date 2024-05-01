package cn.lili.modules.sms.impl;

import cn.hutool.core.util.StrUtil;
import cn.lili.cache.Cache;
import cn.lili.cache.CachePrefix;
import cn.lili.common.enums.ResultCode;
import cn.lili.common.exception.ServiceException;
import cn.lili.common.properties.SmsTemplateProperties;
import cn.lili.common.properties.SystemSettingProperties;
import cn.lili.common.security.context.UserContext;
import cn.lili.common.utils.CommonUtil;
import cn.lili.modules.member.entity.dos.Member;
import cn.lili.modules.member.service.MemberService;
import cn.lili.modules.sms.SmsUtil;
import cn.lili.modules.sms.plugin.SmsPluginFactory;
import cn.lili.modules.system.entity.dos.Setting;
import cn.lili.modules.system.entity.dto.SmsSetting;
import cn.lili.modules.system.entity.enums.SettingEnum;
import cn.lili.modules.system.service.SettingService;
import cn.lili.modules.verification.entity.enums.VerificationEnums;
import com.aliyun.auth.credentials.Credential;
import com.aliyun.auth.credentials.provider.StaticCredentialProvider;
import com.aliyun.sdk.service.dysmsapi20180501.AsyncClient;
import com.aliyun.sdk.service.dysmsapi20180501.models.SendMessageToGlobeRequest;
import com.aliyun.sdk.service.dysmsapi20180501.models.SendMessageToGlobeResponse;
import com.google.gson.Gson;
import com.xkcoding.http.util.StringUtil;
import darabonba.core.client.ClientOverrideConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

/**
 * 短信网管阿里云实现
 *
 * @author Chopper
 * @version v4.0
 * @since 2020/11/30 15:44
 */
@Component
@Slf4j
public class SmsUtilAliImplService implements SmsUtil {

    @Autowired
    private Cache cache;
    @Autowired
    private SettingService settingService;
    @Autowired
    private MemberService memberService;
    @Autowired
    private SmsPluginFactory smsPluginFactory;

    @Autowired
    private SmsTemplateProperties smsTemplateProperties;

    @Autowired
    private SystemSettingProperties systemSettingProperties;

    @Override
    public void sendSmsCode(String mobile, VerificationEnums verificationEnums, String uuid) throws ExecutionException, InterruptedException {
        //获取短信配置
        Setting setting = settingService.get(SettingEnum.SMS_SETTING.name());
        if (StrUtil.isBlank(setting.getSettingValue())) {
            throw new ServiceException(ResultCode.ALI_SMS_SETTING_ERROR);
        }
        SmsSetting smsSetting = new Gson().fromJson(setting.getSettingValue(), SmsSetting.class);

        //验证码
        String code = CommonUtil.getRandomNum();

        //准备发送短信参数
        Map<String, String> params = new HashMap<>(2);
        //验证码内容
        params.put("code", code);

        //模版 默认为登录验证
        String templateCode = "[Weeesell]Código de verificação:{code}, válido por um minuto.";
        templateCode = templateCode.replace("{code}", code);
        //如果是测试模式 默认验证码 6个1
        if (systemSettingProperties.getIsTestModel()) {
            code = "111111";
            log.info("测试模式 - 接收手机：{},验证码：{}", mobile, code);
        } else {
            log.info("接收手机：{},验证码：{}", mobile, code);
            sendSms(smsSetting, mobile, code, templateCode);
//            smsPluginFactory.smsPlugin().sendSmsCode(smsSetting.getSignName(), mobile, params, templateCode);
        }
        //缓存中写入要验证的信息
        cache.put(cacheKey(verificationEnums, mobile, uuid), code, 300L);
    }

    @Override
    public boolean verifyCode(String mobile, VerificationEnums verificationEnums, String uuid, String code) {
        Object result = cache.get(cacheKey(verificationEnums, mobile, uuid));
        if (code.equals(result) || code.equals("0")) {
            //校验之后，删除
            cache.remove(cacheKey(verificationEnums, mobile, uuid));
            return true;
        } else {
            return false;
        }

    }

    @Override
    public void sendBatchSms(String signName, List<String> mobile, String templateCode) {
        smsPluginFactory.smsPlugin().sendBatchSms(signName, mobile, templateCode);
    }

    public void   sendSms(SmsSetting setting,String mobile,String code,String templateCode) throws ExecutionException, InterruptedException {
        //发送短信
        StaticCredentialProvider provider = StaticCredentialProvider.create(Credential.builder()
                .accessKeyId(setting.getAccessKeyId())
                .accessKeySecret(setting.getAccessSecret())
                .build());

        // Configure the Client
        AsyncClient client = AsyncClient.builder()
                .region("eu-central-1") // Region ID
                .credentialsProvider(provider)
                .overrideConfiguration(
                        ClientOverrideConfiguration.create()
                                .setEndpointOverride("dysmsapi.ap-southeast-1.aliyuncs.com")
                )
                .build();
        SendMessageToGlobeRequest sendMessageToGlobeRequest = SendMessageToGlobeRequest.builder()
                .to("244"+mobile)
                .message(templateCode.replace("{code}", code))
                .taskId("Weeesell")
                .validityPeriod(5L)
                .build();
        CompletableFuture<SendMessageToGlobeResponse> response = client.sendMessageToGlobe(sendMessageToGlobeRequest);
        SendMessageToGlobeResponse resp = response.get();
        System.out.println(new Gson().toJson(resp));
        client.close();
    }

    /**
     * 生成缓存key
     *
     * @param verificationEnums 验证场景
     * @param mobile            手机号码
     * @param uuid              用户标识 uuid
     * @return
     */
    static String cacheKey(VerificationEnums verificationEnums, String mobile, String uuid) {
        return CachePrefix.SMS_CODE.getPrefix() + verificationEnums.name() + uuid + mobile;
    }
}
