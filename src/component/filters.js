import React, { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { fetchSpaceXData, updateSpaceXData } from "../store/datastore";

import moment from "moment";

export default function BlogFilters() {
  const spaceXData = useSelector((state) => state.spacex);

  const dispatch = useDispatch();

  const [state, setState] = useState({
    search: "",
    launch_status: "",
    launch_date: "",
  });
  // const [spaceData, setSpaceData] = useState();

  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    let data = spaceXData.dup;
    if (
      state.search.length > 0 ||
      state.launch_status.length > 0 ||
      state.launch_date.length > 0
    ) {
      let filterData = filterFnx(state, data);
      if (filterData && filterData?.length >= 0) {
        dispatch(updateSpaceXData(filterData));
      }
    } else {
      dispatch(updateSpaceXData(data));
    }
  }, [state, setState]);

  // useEffect(() => {
  //   setSpaceData(spaceXData.data);
  // }, [spaceXData]);

  return (
    <div>
      <Form.Row className="align-items-center mb-4">
        <Col sm="3">
          <Form.Group controlId="searchData">
            <Form.Control
              type="text"
              placeholder="Type here to search..."
              name="search"
              disabled={spaceXData.status != "success"}
              className="rounded"
              onChange={(e) => {
                setTimeout(() => {
                  handleChange(e);
                }, 700);
              }}
            />
          </Form.Group>
        </Col>
        <Col sm="9">
          <Row className="align-items-center">
            <Col sm="2"></Col>
            <label className="col-sm-2">Filter By: </label>
            <Col sm="4">
              <Form.Group controlId="launchDates">
                <Form.Control
                  as="select"
                  name="launch_date"
                  disabled={spaceXData.status != "success"}
                  onChange={handleChange}
                >
                  <option value="">By Launch Date</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="year">Last Year</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col sm="4">
              <Form.Group controlId="launchStatus">
                <Form.Control
                  as="select"
                  name="launch_status"
                  disabled={spaceXData.status != "success"}
                  onChange={handleChange}
                >
                  <option value="">By Launch Status</option>
                  <option value="failure">Failure</option>
                  <option value="success">Success</option>
                  <option value="upcoming">Upcoming</option>
                </Form.Control>
              </Form.Group>
            </Col>
            {/* <Col sm="3" md="1" className="mb-3">
                <Button variant="secondary" onClick={clearFilters}>
                    Clear
                </Button>
            </Col> */}
          </Row>
        </Col>
      </Form.Row>
    </div>
  );
}

export const filterFnx = (data, array) => {
  const { launch_date, launch_status, search } = data;
  let cpyArr = Array.from(array);
  console.log("cpy ", cpyArr);

  const getDateDiff = (item) => {
    let b = moment(item.launch_date_local);
    let a = moment();
    let x = a.diff(b, "days");
    return x;
  };

  const filLaunch = (data, launch_status) => {
    let arr = [];
    if (data.length > 0) {
      if (launch_status == "failure") {
        let res = data.filter((item) => item.launch_success == false);
        arr = res;
      } else if (launch_status == "success") {
        let res = data.filter((item) => item.launch_success == true);
        arr = res;
      } else if (launch_status == "upcoming") {
        let res = data.filter((item) => item.upcoming == true);
        arr = res;
      }
    }
    return arr;
  };

  const filDate = (data, launch_date) => {
    let arr = [];
    if (data.length > 0) {
      if (launch_date == "week") {
        let res = data.filter((item) => {
          if (getDateDiff(item) <= 7) {
            return item;
          }
        });
        arr = res;
      } else if (launch_date == "month") {
        let res = data.filter((item) => {
          if (getDateDiff(item) <= 31) {
            return item;
          }
        });
        arr = res;
      } else if (launch_date == "year") {
        let res = data.filter((item) => {
          if (getDateDiff(item) >= 365) {
            return item;
          }
        });
        arr = res;
      }
    }
    return arr;
  };

  const filSearch = (data, search) => {
    let arr = [];
    if (data.length > 0) {
      if (search && search?.length > 0) {
        let srch = data.filter(
          (obj) =>
            obj?.mission_name?.toLowerCase().includes(search.toLowerCase()) ||
            obj?.details?.toLowerCase().includes(search.toLowerCase())
        );
        arr = srch;
      }
    }
    return arr;
  };

  if (search.length > 0 || launch_status.length > 0 || launch_date.length > 0) {
    if (launch_date) {
      cpyArr = [...filDate(cpyArr, launch_date)];
    }
    if (launch_status) {
      cpyArr = [...filLaunch(cpyArr, launch_status)];
    }
    if (search) {
      cpyArr = [...filSearch(cpyArr, search)];
    }
  }

  return cpyArr;
};
