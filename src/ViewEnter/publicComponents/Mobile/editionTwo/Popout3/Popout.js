import "./Popout.less";
import { $http,  getBrowserSource } from '@function/Function';

import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { Form, Input, Button } from 'antd';
const clsImg = require('./close.png');
const FormItem = Form.Item;
class DialogForm extends Component {
  constructor(props){
    super(props);
    this.browserSource = getBrowserSource();
    this.state = {
      remark:''
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      browserSource,
      props: {
        form,
        hideDialog,
        activitySoure,
        activityId
      }
    } = this;
    form.validateFields((err, values) => {
      if (!err) {
        $http.post(this, {
          url: "/live/activityPrepareExam/front/saveActivityPrepareExam",
          dataType: "json",
          data: {
            ...values,
            "activitySoure": activitySoure,
            "activityId": activityId,
            "pageSource": browserSource,
            'ipAddress': window.IPdizhi,
            'remark':this.state.remark
          },
          success: function (res) {
            if (res.success) {
              form.resetFields();
              Toast.success(res.msg, 2);
              hideDialog();
            } else {
              Toast.fail(res.msg, 2);
            }
          }
        });
      }
    });
  }
  componentDidMount() {
      let reurl = window.location.href;
      let remark = reurl.substring(0,28);
      if(remark == 'http://www.boluozaixian.com/'){
        this.setState({
          remark:'bl'
        })
      }else{
        this.setState({
          remark:'sd'
        })
      }
    }
  render () {
    const { form: { getFieldDecorator }, hideDialog, dialog } = this.props;
    return (
      <section className={dialog ? 'diaWrap' : 'none'}>
        <div className="dialog">
          <a href="javascript:void(0);" onClick={hideDialog} className="clsBtn">
            <img src={clsImg} alt="" className="clsImg" />
          </a>
          <div className="diaTit">立即提交<br />短时间内给予回复</div>
          <Form onSubmit={this.handleSubmit}>
            <FormItem className="formItem">
              {getFieldDecorator('studentName', {
                rules: [{
                    required: true, message: '请输入姓名！',
                }],
              })(
                <Input placeholder="姓名" className="diaInp"/>
              )}
            </FormItem>
            <FormItem className="formItem">
              {getFieldDecorator('grade', {
                rules: [{
                  required: true, message: '请输入年级！',
                }],
              })(
                <Input placeholder="年级" className="diaInp" />
              )}
            </FormItem>
            <FormItem className="formItem">
              {getFieldDecorator('phone', {
                rules: [{
                  required: true,
                  message: '请输入正确的手机号码！',
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[0135678]|19[89]|18[0-9]|14[57])[0-9]{8}$/
                }],
                validateTrigger: 'onBlur'
              })(
                <Input type="phone" placeholder="手机号" className="diaInp" />
              )}
            </FormItem>
            <FormItem>
              <Button className="diaBtn" htmlType="submit">
                立即提交
              </Button>
            </FormItem>
          </Form>
        </div>
        <div className="modalbg" onClick={hideDialog}></div>
      </section>
    )
  }
}

const Popout = Form.create()(DialogForm);


export default Popout;