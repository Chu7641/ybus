import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { useForm } from "antd/lib/form/Form";
import React, { useEffect, useState } from "react";
import seatTemplateApi from "../../api/seatTemplate";
import IntlMessages from "../../components/IntlMessage";
import { chunk } from "lodash";

CreateForm.propTypes = {};

function CreateForm(props) {
  const [form] = useForm();
  const [form2] = useForm();
  const { onReload, onClose, currentData } = props;
  const [loading, setLoading] = useState(false);
  const [dataMap, setDataMap] = useState([]);
  const [matrix, setMatrix] = useState([]);
  const [hidden, setHidden] = useState(true);

  const handleCancel = () => {
    onClose();
  };
  const onFinish = async () => {
    form2.validateFields().then(async () => {
      const values = form2.getFieldValue();
      let num = values.seatnumber;
      let keys = Object.keys(num).sort();
      let arr = [];
      keys.map((k) => {
        arr.push(num[k]);
      });
      console.log(arr);
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
        title: form.getFieldValue().title,
        block_layout: dataJSON,
      };
      await seatTemplateApi
        .create(uData)
        .then((res) => {
        //   console.log(uData);
          setLoading(false);
          handleCancel();
          onReload();
        })
        .catch((error) => setLoading(false));
    //   console.log(cData);
    //   console.log(uData);
    });
  };

  const generateArray = (m, n) => {
    let arr = new Array(n).fill(0).map(() => new Array(m).fill(0));
    return arr;
  };

  const onFinishForm = (values) => {
    // console.log(values);
    setLoading(true);
    const m = parseInt(values.column);
    const n = parseInt(values.row);
    const arr = generateArray(m, n);
    setMatrix(arr);
    setHidden(false);
    setLoading(false);
  };
  const handleChangeForm = (values) => {
    // console.log(form2.getFieldValue());
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
    let newData = matrixSeat.block_type.map((type, index) => {
      return {
        type: type,
        seat: matrixSeat.seatnumber[index],
      };
    });
    // console.log(newData);
    const datachunk3 = chunk(newData, form.getFieldValue().column);
    // console.log(datachunk3);
    setDataMap(datachunk3);
  };
  const renderMap = () => {
    // let data=form2.getFieldValue();
    // console.log("datachunk2", dataMap);
    return dataMap.map((res, index) => {
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
  const { Option } = Select;

  useEffect(() => {
    //  console.log("abc");
    //  onFinishForm();
  }, []);

  return (
    <Modal
      title={<IntlMessages id="global.add" />}
      visible={true}
      destroyOnClose={true}
      onCancel={handleCancel}
      // footer={null}
      onOk={onFinish}
      width="70%"
      footer={[
        <Button onClick={handleCancel}>
          <IntlMessages id="global.cancel" />
        </Button>,
        <Button
          disabled={hidden}
          key="submit"
          type="primary"
          loading={loading}
          onClick={onFinish}
        >
          <IntlMessages id="global.save" />
        </Button>,
      ]}
    >
      <Form
        form={form}
        onFinish={onFinishForm}
        name="horizontal_login"
        layout="inline"
        // onFinish={onFinish}
      >
        <Form.Item
          // initialValue="titleabc"
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: <IntlMessages id="global.requirefield" />,
            },
          ]}
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
      <div>
        <p>Note:</p>
        <p>T: Type</p>
        <p>N: Seat Number</p>
      </div>
      <Row>
        <Col>
          {matrix.map((subdata, index) => {
            return (
              <Row key={index}>
                {subdata.map((item, subIndex) => {
                  return (
                    <div key={subIndex} className="bus-template-item">
                      <Form
                        name="templateSeat"
                        form={form2}
                        onValuesChange={handleChangeForm}
                      >
                        <Form.Item
                          label="T:"
                          name={["type", `${[index, subIndex]}`]}
                          rules={[
                            {
                              required: true,
                              message: (
                                <IntlMessages id="global.requirefield" />
                              ),
                            },
                          ]}
                        >
                          <Select>
                            <Option value="seat">Seat</Option>
                            <Option value="hidden">Hidden</Option>
                          </Select>
                        </Form.Item>
                        <Form.Item
                          label="N:"
                          name={["seatnumber", `${[index, subIndex]}`]}
                          rules={[
                            {
                              required: true,
                              message: (
                                <IntlMessages id="global.requirefield" />
                              ),
                            },
                          ]}
                        >
                          <Input
                            style={{ width: 120, display: "inline-block" }}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  );
                })}
              </Row>
            );
          })}
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

export default CreateForm;
