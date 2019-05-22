# -*- coding: utf-8	-*-
import hashlib
from flask import Flask,request,render_template
from wechat_sdk import (WechatBasic,WechatConf)
import paho.mqtt.client as mqtt
import threading
import json
app = Flask(__name__)


ACCESS_TOKEN ="21_JBj-PdSDpvPUE_500druhgyRQ53YVMKNnOB3b0bE-s8BS7pEqgJ0BBVotgylMNCJH4h3IDpzVouLE-4kWdt35WNxSp987B7tht4jOEh3ukPgTHzKsi4f6MYVOT1jsJPklqshczny3H4xxlTkKQWfAIAQWC"
ACCSEE_TOKEN_EXPIRES_AT = 7200
APPID = "wx97bb90170b328cc7"
APPSECRET ="a1bb31a01b3f8683a2cb4a0f751ab84c"


test_json = {'text': {'content': b'sadfasdfasdfasdf'.decode('utf-8')}, 'touser': 'oVHwp6KEICn9DgfdgQ6-jsuDGowY', 'msgtype': 'text'}
print (json.dumps(test_json))

conf = WechatConf(appid = APPID,appsecret = APPSECRET,encrypt_mode="normal",access_token = ACCESS_TOKEN,access_token_expires_at=ACCSEE_TOKEN_EXPIRES_AT)
conf.get_access_token()
print (conf.get_access_token())
wechat = WechatBasic(conf)

############################################################################################
HOST_NGROK = "0.tcp.ngrok.io"
PORT_NGROK = 19192
HOST_LOCAL = "192.168.0.114"
PORT_LOCAL = 1883
USERNAME = "lijun"
PASSWORD ="1234qwer"
CLIENT_ID = "123"
SUBJECT_FOR_PUBLISH = "req_ota_info"
SUBJECT_FOR_SUBSCRIBE = "client_on_line"
client = mqtt.Client(CLIENT_ID)

def run_mqtt():
	print("run_mqtt")
	client.username_pw_set(USERNAME, PASSWORD)
	client.on_connect = on_connect
	client.on_message = on_message
	client.connect(HOST_NGROK, PORT_NGROK, 10)
	print("before loop\n")
	client.loop_forever()
	print("after loop\n")

def on_connect(client, userdata, flags, rc):
	client.subscribe(SUBJECT_FOR_SUBSCRIBE)

def on_message(client, userdata, msg):
	#wechat = WechatBasic()
	print ("on_message:" )
	return wechat.send_text_message("oVHwp6KEICn9DgfdgQ6-jsuDGowY",msg.payload.decode('utf-8'))
	#return wechat.response_text(msg.payload)

	pass

def pub_req_ota_info(sub,text):
	client.publish("req_ota_info",text)
	return "mqtt publish sub[{}],msg[{}]".format(sub,text)
############################################################################################
@app.route('/wx',methods=["GET"])
def test1():
	print(request)
	signature =	request.args.get('signature')
	timestamp =	request.args.get('timestamp')
	nonce =	request.args.get('nonce')
	echostr =	request.args.get('echostr')
	token =	"1234qwer" #请按照公众平台官网\基本配置中信息填写
	list = [token, timestamp, nonce]
	list.sort()
	sha1 = hashlib.sha1()
	map(sha1.update, list)
	hashcode = sha1.hexdigest()
	print("	hashcode: \n", hashcode)
	print("	signature: \n",	 signature)
	print("	echostr: \n",  echostr)
	print("	timestamp: \n",	 timestamp)
	print("	nonce: \n",	 nonce)
	####骗过微信服务器 有些时候能成功 有些时候会失败
	return echostr
	# if hashcode	== signature:
	# 	return echostr
	# else:
	# 	return ""

@app.route('/wx',methods=["POST"])
def test2():

	wechat.parse_data(request.data)
	message = wechat.message
	print ("request:\n{}\nheader:\n{}\ndata:\n{}\n".format(request,request.headers,request.data))
	if message.type == "text":
		pub_req_ota_info(SUBJECT_FOR_PUBLISH,message.content)
		return  wechat.response_text(message.content)
	elif message.type == "voice":
		return  wechat.response_voice(message.media_id)
	elif message.type == "image":
		return  wechat.response_image(message.media_id)
	#elif message.type == "view":
	#	print(message.key)
		#return render_template('netconfig.html',openid = message.target,deviceType=message.source)
	#	return wechat.response_text("test")
	elif message.type == "click":
		pub_req_ota_info(SUBJECT_FOR_PUBLISH,message.type)
		return wechat.response_text(SUBJECT_FOR_PUBLISH,"test")
	else:
		return wechat.response_none()




if __name__ == '__main__':
	print("main\n")
	thread_mqtt = threading.Thread(target = run_mqtt)
	thread_mqtt.setDaemon(True)
	thread_mqtt.start()

	app.run(port= 80,debug=False)
	#### debug = True的话 会造成两次执行main