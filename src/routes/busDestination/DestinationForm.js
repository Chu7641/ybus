import {
    Form,
    Input, Modal
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import destinationApi from "../../api/destination";
import IntlMessages from "../../components/IntlMessage";

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 20 },
};

export default function AgentForm(props) {
  const isMount = useRef(false);
  const { onReload, onClose, currentData } = props;
  console.log(currentData);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataCountry, setDataCountry] = useState({
    latitude: currentData && currentData.latitude ? currentData.latitude : "",
    longitude:
      currentData && currentData.longitude ? currentData.longitude : "",
  });

  const [value, setValue] = useState(null);
  useEffect(() => {
    isMount.current = true;
  }, []);

  const handleSubmit = () => {
    form.validateFields().then(async () => {
      const dataForm = form.getFieldValue();
      let data = {
        ...dataCountry,
        title: dataForm.title,
        alias: dataForm.alias,
        code: dataForm.code,
      };
      let dataUpdate = {
        ...data,
        id: currentData && currentData.id ? currentData.id : "",
      };
      console.log(data);
      setLoading(true);
      if (currentData) {
        destinationApi
          .update(dataUpdate)
          .then((res) => {
            console.log(data);
            setLoading(false);
            handleCancel();
            onReload();
          })
          .catch((error) => setLoading(false));
      } else {
        destinationApi
          .create(data)
          .then((res) => {
            setLoading(false);
            handleCancel();
            onReload();
          })
          .catch((error) => setLoading(false));
      }
    });
  };
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current > moment().endOf("day");
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    // form.resetFields();
    onClose();
  };

  const initialValue = {
    title: currentData && currentData.title ? currentData.title : "",
    alias: currentData && currentData.alias ? currentData.alias : "",
    code: currentData && currentData.code ? currentData.code : "",
  };

  const handleValue = (value) => {
    setValue(value);
    console.log(value);
    let country = value.label;
    geocodeByAddress(country)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setDataCountry({
          //  title:value.label,
          latitude: lat,
          longitude: lng,
        })
      );
  };
  // console.log(data);
  return (
    <Modal
      title={
        currentData ? (
          <IntlMessages id="global.edit" />
        ) : (
          <IntlMessages id="global.add" />
        )
      }
      visible={true}
      destroyOnClose={true}
      onCancel={handleCancel}
      onOk={handleSubmit}
      // footer={null}
      width="60%"
    >
      <div style={{ margin: "1rem" }}>
        <p>
          <IntlMessages id="global.select_destination" />
        </p>
        <GooglePlacesAutocomplete
          apiKey="AIzaSyBfENPOXpbQfCOmnet3FwzlsIOaj8ekYxg"
          selectProps={{
            defaultInputValue:
              currentData && currentData.title ? currentData.title : "",
            value,
            onChange: handleValue,
            // placeholder:currentData && currentData.title ? currentData.title : "",
          }}
        />
      </div>
      <Form
        {...layout}
        form={form}
        initialValues={initialValue}
        labelAlign="left"
        onFinish={handleSubmit}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label={<IntlMessages id="global.title" />}
          name="title"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<IntlMessages id="global.alias" />}
          name="alias"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<IntlMessages id="global.code" />}
          name="code"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requiredfield" />,
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
