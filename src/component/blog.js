import React, { useState, useEffect } from "react";
import {
  Col,
  Row,
  Card,
  Badge,
  Container,
  Modal,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import BlogFilters from "./filters";
import moment from "moment";

export default function SpaceBlog() {
  const data = useSelector((state) => state.spacex.data);
  const [state, setState] = useState([]);
  const [stateDup, setStateDup] = useState([]);
  const [show, setShow] = useState(false);
  const [modalInfo, setModalInfo] = useState();

  const handleClose = () => {
    setShow(false);
    setModalInfo();
  };

  const handleShow = () => setShow(true);

  const openModal = (e) => {
    const id = e.target.getAttribute("dataid");
    setModalInfo(state[id]);
    handleShow();
  };

  const getDateDiff = (item) => {
    let b = moment(item.launch_date_local);
    let a = moment();
    let x = a.diff(b, "days");
    return x;
  };

  const filLaunch = (data, launch_status) => {
    let arr = [];
    if (launch_status == "failure") {
      let res = data.filter((item) => item.launch_success == false);
      arr = res;
    } else if (launch_status == "success") {
      let res = data.filter((item) => item.launch_success == true);
      arr = res;
    } else if (launch_status == "upcoming") {
      let res = data.filter((item) => item.upcoming == true);
      arr = res;
    } else {
      arr.push(stateDup);
    }
    return arr;
  };

  const filDate = (data, launch_date) => {
    let arr = [];
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
    } else {
      arr.push(stateDup);
    }
    return arr;
  };

  const filDateLaunch = (data, launch_date, launch_status) => {
    let cpyArr = data.slice();
    let filterArr = [];
    filterArr = [...filDate(cpyArr, launch_date)];
    filterArr = [...filLaunch(filterArr, launch_status)];
    return filterArr;
  };

  const selectedFilters = (data) => {
    const { launch_date, launch_status, search } = data;
    console.log(data, launch_date, launch_status);
    let cpyArr = Array.from(stateDup);
    let filterArr = [];
    if (launch_date && !launch_status) {
      filterArr = [...filDate(cpyArr, launch_date)];
    } else if (!launch_date && launch_status) {
      filterArr = [...filLaunch(cpyArr, launch_status)];
    } else if (launch_date && launch_status) {
      filterArr = [...filDateLaunch(cpyArr, launch_date, launch_status)];
    } else if (!launch_date && !launch_status) {
      filterArr.push(stateDup);
    }

    if (search && search.length > 0) {
      let srch = stateDup.filter((obj) =>
        obj.mission_name.toLowerCase().includes(search.toLowerCase())
      );
      filterArr = [...srch];
    }
    // else {
    //   filterArr = [...stateDup];
    // }
    setState(filterArr);
  };

  useEffect(() => {
    // console.log("eff ", data);
    setState(data);
    setStateDup(data);
  }, [data]);

  // useEffect(() => {
  //   let b = moment("2021-04-17T10:30:00+12:00");
  //   let a = moment();
  //   let x = a.diff(b, "days");
  //   console.log(x);
  // }, []);

  return (
    <Container>
      <h3 className="text-center pt-3 mb-5">SpaceX Journey</h3>

      <BlogFilters selectedFilters={selectedFilters} />

      <BlogCards state={state} openModal={openModal} />
      {/* modal */}
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Flight Name:{" "}
            {modalInfo?.mission_name ? modalInfo.mission_name : "Unavailable"}
            <div style={{ fontSize: "16px" }}>
              <BadgeCards item={modalInfo} />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5 className="text-muted">Description: </h5>
          <p>
            {modalInfo?.details?.length > 0 ? modalInfo.details : "Unavailable"}
          </p>
          {!modalInfo?.launch_success && (
            <>
              <h5 className="text-muted mt-3">Failure Details: </h5>
              {modalInfo?.launch_failure_details?.length > 0
                ? modalInfo?.launch_failure_details
                : "Unavailable"}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

const BlogCards = ({ state, openModal }) => {
  return (
    <Row>
      {state.length > 0 &&
        state.map((item, idx) => (
          <Col key={idx} sm="6" md="6" lg="4" className="mb-4">
            <Card className="h-100">
              <Card.Body className="pb-5 position-relative">
                <Card.Title>
                  {item?.mission_name ? item?.mission_name : "N/A"}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <BadgeCards item={item} />
                </Card.Subtitle>
                <hr />
                <Card.Text>
                  <b className="text-muted">Description: </b>
                  {item?.details?.length > 0
                    ? item?.details?.length > 120
                      ? `${item.details.substring(0, 60)}...`
                      : item.details
                    : "Unavailable"}
                </Card.Text>
                <Card.Link
                  onClick={openModal}
                  dataid={idx}
                  className="position-absolute"
                  style={learnMoreBtn}
                >
                  Learn More
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
    </Row>
  );
};
const BadgeCards = ({ item }) => {
  return (
    <>
      {item?.launch_date_local && (
        <Badge pill variant="info" className="mr-2">
          <TimeCard date={item?.launch_date_local} />
        </Badge>
      )}
      {JSON.stringify(item?.launch_success) && (
        <Badge
          pill
          variant={item.launch_success ? "success" : "warning"}
          className="mr-2"
        >
          {item.launch_success ? "Success" : "Failure"}
        </Badge>
      )}
      {item?.upcoming && (
        <Badge pill variant="secondary">
          Upcoming
        </Badge>
      )}
    </>
  );
};
const TimeCard = ({ date }) => {
  const dateString = new Date(date);
  const minTwoDigit = (n) => {
    return (n < 10 ? "0" : "") + n;
  };
  let dateConv = function formatDate(dateStr) {
    const day = minTwoDigit(dateStr.getDate());
    const month = minTwoDigit(dateStr.getMonth() + 1);
    const year = dateStr.getFullYear();
    let val = `${year}-${month}-${day}`;
    return val;
  };
  return dateConv(dateString);
};

const learnMoreBtn = {
  bottom: "15px",
  cursor: "pointer",
};
