import React, { useState, useEffect } from "react";
import { Form, Col, Row, Button } from "react-bootstrap";

export default function BlogFilters({ selectedFilters }) {
  const [state, setState] = useState();
  const handleChange = (e) => {
    setState((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  //   const clearFilters = (e) => {
  //     e.preventDefault();
  //     setState();
  //   };

  useEffect(() => {
    if (state) {
      selectedFilters(state);
    }
  }, [state, setState]);

  return (
    <div>
      <Form.Row className="align-items-center mb-4">
        <Col sm="3">
          <Form.Group controlId="searchData">
            <Form.Control
              type="text"
              placeholder="Type here to search..."
              name="search"
              className="rounded"
              onChange={handleChange}
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
