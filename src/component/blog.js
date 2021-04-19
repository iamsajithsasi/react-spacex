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

export default function SpaceBlog() {
  const spaceXData = useSelector((state) => state.spacex);
  const [state, setState] = useState([]);
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

  useEffect(() => {
    setState(spaceXData.data);
  }, [spaceXData]);

  return (
    <Container>
      <h3 className="text-center pt-3 mb-5">SpaceX Journey</h3>

      <BlogFilters />

      {spaceXData.status == "pending" ? (
        <p>Loading Data...</p>
      ) : spaceXData.status == "error" ? (
        <p>Error!!! Unable to load data. Please try again later</p>
      ) : (
        <BlogCards state={state} openModal={openModal} />
      )}

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
              {modalInfo?.launch_failure_details?.reason?.length > 0
                ? modalInfo?.launch_failure_details.reason
                : "Unavailable"}
            </>
          )}
          <h5 className="text-muted mt-3">Resources: </h5>
          <Row>
            <Col sm="6" className="my-3">
              {modalInfo?.links?.mission_patch && (
                <img
                  style={{
                    width: "100%",
                    maxWidth: "300px",
                    objectFit: "cover",
                  }}
                  src={modalInfo?.links?.mission_patch}
                  alt="image-detail"
                />
              )}
            </Col>
            <Col sm="6" className="my-3">
              <iframe
                title="video"
                src={`https://www.youtube.com/embed/${modalInfo?.links?.youtube_id}`}
              ></iframe>
            </Col>
          </Row>
          <div className="mt-3">
            <a href={modalInfo?.links?.wikipedia}>
              <u>Read more from WIKI</u>
            </a>
          </div>
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
      {state && state?.length > 0 ? (
        state.map((item, idx) => (
          <Col key={idx} sm="6" md="6" lg="4" className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body className="pb-5 position-relative">
                <Card.Title>
                  <div className="d-flex">
                    <div className="d-flex flex-column w-100">
                      <span>
                        {item?.mission_name ? item?.mission_name : "N/A"}
                      </span>
                      <div>
                        <BadgeCards item={item} />
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      {item?.links?.mission_patch_small && (
                        <img
                          style={{ maxWidth: "60px", objectFit: "cover" }}
                          src={item?.links?.mission_patch_small}
                          alt="image"
                        />
                      )}
                    </div>
                  </div>
                </Card.Title>
                {/* <Card.Subtitle className="mb-2 text-muted">
                  <BadgeCards item={item} />
                </Card.Subtitle> */}
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
        ))
      ) : (
        <p>No data available</p>
      )}
    </Row>
  );
};
const BadgeCards = ({ item }) => {
  return (
    <>
      {item?.launch_date_local && (
        <Badge pill variant="info" className="mr-2">
          <small>
            <TimeCard date={item?.launch_date_local} />
          </small>
        </Badge>
      )}
      {JSON.stringify(item?.launch_success) && (
        <Badge
          pill
          variant={item.launch_success ? "success" : "warning"}
          className="mr-2"
        >
          <small>{item.launch_success ? "Success" : "Failure"}</small>
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
