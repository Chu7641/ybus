import { Button, Form, Input, Modal, Row, Col, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import { chunk } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import seatTemplateApi from "../../api/seatTemplate";
import IntlMessages from "../../components/IntlMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

TemplateForm.propTypes = {};

function TemplateForm(props) {
  const isMount = useRef(false);
  const { onReload, onClose, currentData } = props;
  // console.log(currentData);
  const [loading, setLoading] = useState(false);
  const [form] = useForm();
  const [form2] = useForm();
  const blockLayout = JSON.parse(currentData.block_layout);
  let newData = blockLayout.block_type.map((type, index) => {
    return {
      type: type,
      seat: blockLayout.seatnumber[index],
    };
  });
  // console.log(newData);

  const datachunk = chunk(newData, blockLayout.column);
  // console.log(datachunk);
  const [datachunk2, setDatachunk2] = useState(datachunk);

  // decode chuỗi blockLayout từ string về json

  const renderMap = () => {
    // let data=form2.getFieldValue();
    // console.log("datachunk2", datachunk2);
    return datachunk2.map((res, index) => {
      // console.log('ressssss', res)
      return (
        <Row key={index}>
          {res.map((item, colIndex) => {
            return (
              <div key={colIndex}>
                {item.seat != 0 && item.type == "seat" ? (
                  <FontAwesomeIcon color="#16bc8c" icon={["fas", "circle"]} />
                ) : (
                  <FontAwesomeIcon
                    style={{ opacity: 0 }}
                    color="red"
                    icon={["fas", "circle"]}
                  />
                )}
              </div>
            );
          })}
        </Row>
      );
    });
  };
  const handleChangeForm = (values) => {
    // console.log(blockLayout);
    let valuesForm2 = form2.getFieldValue();
    let num = valuesForm2.seatnumber ? valuesForm2.seatnumber : [];
    let keys = Object.keys(num).length ? Object.keys(num).sort() : [];
    let arr = [];
    keys.map((k) => {
      arr.push(num[k]);
    });
    let type = valuesForm2.type ? valuesForm2.type : [];
    let keys2 = Object.keys(type).length ? Object.keys(type).sort() : null;
    let arr2 = [];
    keys2.map((k) => {
      arr2.push(type[k]);
    });
    const matrixSeat = {
      block_type: arr2,
      seatnumber: arr,
    };
    // console.log("matrixSeat", matrixSeat);
    let newData = matrixSeat.block_type.map((type, index) => {
      return {
        type: type,
        seat: matrixSeat.seatnumber[index],
      };
    });
    // console.log(newData);
    const datachunk3 = chunk(
      newData,
      blockLayout.column == form.getFieldValue().column
        ? blockLayout.column
        : form.getFieldValue().column
    );
    setDatachunk2(datachunk3);
  };
  const flechData = () => {
    // console.log('datachunk2', datachunk2);
    return (
      <Form
        onValuesChange={handleChangeForm}
        name="templateSeat"
        className="bus-template-item1"
        onFinish={onFinish}
        form={form2}
      >
        {datachunk2.map((subdata, index) => {
          return (
            <Row key={index}>
              {subdata.map((item, subIndex) => {
                return (
                  <div key={(index, subIndex)} className="bus-template-item">
                    <Form.Item
                      initialValue={item.type}
                      name={["type", `${[index, subIndex]}`]}
                      label="T:"
                      rules={[
                        {
                          required: true,
                          message: <IntlMessages id="global.requirefield" />,
                        },
                      ]}
                    >
                      <Select>
                        <Option value="seat">
                          <IntlMessages id="car.seat" />
                        </Option>
                        <Option value="hidden">
                          <IntlMessages id="global.hidden" />
                        </Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      initialValue={item.seat}
                      rules={[
                        {
                          required: true,
                          message: <IntlMessages id="global.requirefield" />,
                        },
                      ]}
                      name={["seatnumber", `${[index, subIndex]}`]}
                      label="N:"
                    >
                      <Input style={{ width: 120 }} />
                    </Form.Item>
                  </div>
                );
              })}
            </Row>
          );
        })}
      </Form>
    );
  };

  useEffect(() => {}, []);

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const initialValue = {
    title: currentData && currentData.title ? currentData.title : "",
    row: blockLayout && blockLayout.row ? blockLayout.row : "",
    column: blockLayout && blockLayout.column ? blockLayout.column : "",
  };
  const generateArray = (col, row) => {
    let arr = new Array(row).fill(0).map(() =>
      new Array(col).fill({
        seat: "",
        type: "",
      })
    );
    return arr;
  };

  const onFinishForm = async (values) => {
    // console.log('Received values of form:', values);
    const col = parseInt(values.column);
    const row = parseInt(values.row);
    const arr = generateArray(col, row);
    setDatachunk2(arr);
    // console.log(datachunk2);
    await form2.resetFields();
  };
  const { Option } = Select;
  const onFinish = async (value) => {
    //   console.log('Received values of form:', value);
    setLoading(true);
    form2.validateFields().then(async () => {
      const values = form2.getFieldValue();
      let num = values.seatnumber;
      let keys = Object.keys(num).sort();
      let arr = [];
      keys.map((k) => {
        arr.push(num[k]);
      });
      // console.log(arr);
      let type = values.type;
      let keys2 = Object.keys(type).sort();
      let arr2 = [];
      keys2.map((k) => {
        arr2.push(type[k]);
      });
      const cData = {
        block_type: arr2,
        column: form.getFieldValue().column,
        row: form.getFieldValue().row,
        seatnumber: arr,
      };
      var dataJSON = JSON.stringify(cData);
      const uData = {
        id: currentData.id,
        title: form.getFieldValue().title,
        block_layout: dataJSON,
      };

      // console.log(cData);
      // console.log(uData);
      await seatTemplateApi
        .update(uData)
        .then((res) => {
        //   console.log(uData);
          setLoading(false);
          handleCancel();
          onReload();
        })
        .catch((error) => setLoading(false));
    });
  };

  const handleResetForm = () => {
    form2.resetFields();
  };

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
      cancelText={<IntlMessages id="global.cancel" />}
      // footer={null}
      onOk={onFinish}
      okText={<IntlMessages id="global.save" />}
      width="70%"
    >
      <Form
        form={form}
        onFinish={onFinishForm}
        initialValues={initialValue}
        layout="inline"
        // onFinish={onFinish}
      >
        <Form.Item
          // initialValue="titleabc"
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Row"
          name="row"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requirefield" />,
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          label="Column"
          name="column"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requirefield" />,
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Change
          </Button>
        </Form.Item>
      </Form>
      {/* <Button onClick={handleResetForm}>abccas</Button> */}
      <div>
        <p>Note:</p>
        <p>T: Type</p>
        <p>N: Seat Number</p>
      </div>
      <Row>
        <Col>
          <div>{flechData()}</div>
        </Col>
        <Col style={{ margin: "auto auto" }}>
          <div style={{ border: "solid 5px #e9e9e9 ", padding: "10px" }}>
            <FontAwesomeIcon
              style={{ marginBottom: "5px" }}
              color="#16bc8c"
              icon={["fas", "dharmachakra"]}
            />
            {renderMap()}
          </div>
        </Col>
      </Row>
    </Modal>
  );
}

export default TemplateForm;
