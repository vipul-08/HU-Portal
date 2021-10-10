import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"
import { database } from "../firebase";

function SingleTrack() {

    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState([]);
    const [assessments, setAssessments] = useState([]);
    const [isTrainer, setTrainer] = useState(false);
    const { programId, trackId } = useParams();

    const [scheduleMeeting, changeScheduleMeeting] = useState(false);
    const [giveAssignment, changeGiveAssignment] = useState(false);
    const [announceAssessment, changeAnnounceAssessment] = useState(false);

    const titleRef = useRef();
    const descRef = useRef();

    const assessmentNameRef = useRef();
    const assessmentStartTimeRef = useRef();
    const assessmentEndTimeRef = useRef();
    const assessmentDateRef = useRef();
    const assessmentTotalPointsRef = useRef();

    const assignmentNameRef = useRef();
    const assignmentDeadlineDateRef = useRef();
    const assignmentTotalScoreRef = useRef();

    const eventNameRef = useRef();
    const eventStartTimeRef = useRef();
    const eventEndTimeRef = useRef();
    const eventDateRef = useRef();
    const eventLinkRef = useRef();

    const setScheduleMeeting = () => {
        database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('events').push().then((snap) => {
            database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('events').child(snap.key).set({
                eventId: snap.key,
                eventName: eventNameRef.current.value,
                date: eventDateRef.current.value,
                startTime: eventStartTimeRef.current.value,
                endTime: eventEndTimeRef.current.value,
                eventLink: eventLinkRef.current.value,
            }).then(() => {
                changeScheduleMeeting(false);
            })
        });
    }

    const setAnnounceAssessment = () => {
        database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('assessments').push().then((snap) => {
            database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('assessments').child(snap.key).set({
                assessmentId: snap.key,
                assessmentName: assessmentNameRef.current.value,
                date: assessmentDateRef.current.value,
                totalPoints: assessmentTotalPointsRef.current.value,
                startTime: assessmentStartTimeRef.current.value,
                endTime: assessmentEndTimeRef.current.value,
            }).then(() => {
                changeAnnounceAssessment(false);
            })
        });
    }

    const setGiveAssignment = () => {
        database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('assignments').push().then((snap) => {
            database.ref().child('Programs').child(programId).child('tracks').child(trackId).child('assignments').child(snap.key).set({
                assignementId: snap.key,
                assignmentName: assignmentNameRef.current.value,
                deadlineDate: assignmentDeadlineDateRef.current.value,
                totalScore: assignmentTotalScoreRef.current.value,
            }).then(() => {
                changeGiveAssignment(false);
            })
        });
    }

    const handleAdd = () => {
        database.ref().child("Users").child(currentUser.uid).child('Programs').child(programId).child('todos').push({
            todoTitle: titleRef.current.value,
            todoDescription: descRef.current.value,
        }).then(() => {
            handleClose();
        });
    }

    useEffect(() => {
        database.ref().child('Users').child(currentUser.uid).child('Programs').child(programId).child('trainer').once('value', (v) => {
            setTrainer((v.val()));
            if (v.val() === false) {
                database.ref().child("Programs").child(programId).child('tracks').child(trackId).once('value', (value) => {
                    setAssignments(Object.keys(value.val().assignments).map((k) => value.val().assignments[k]));
                    setAssessments(Object.keys(value.val().assessments).map((k) => value.val().assessments[k]));
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
        });
    }, []);

    const [modelOpen, openModel] = useState(false);

    const handleClose = () => {
        openModel(false);
    }

    const handleShow = () => {
        openModel(true);
    }

    return loading ? null : <>
        {isTrainer ? 
            <>
                <div className="w-100" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>
                    <Modal show={scheduleMeeting} onHide={() => changeScheduleMeeting(false)}>
                        <Modal.Header closeButton>
                        <Modal.Title>Schedule a meeting</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ marginTop: '10px' }}><input ref={eventNameRef} type="text" placeholder="Enter Meeting Title"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={eventDateRef} type="text" placeholder="Enter date (MM/DD/YYYY)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={eventStartTimeRef} type="text" placeholder="Enter start time (HH:mm)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={eventEndTimeRef} type="text" placeholder="Enter end time (HH:mm)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={eventLinkRef} type="text" placeholder="Enter event joining link"></input></div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => changeScheduleMeeting(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={setScheduleMeeting}>
                            Submit
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={giveAssignment} onHide={() => changeGiveAssignment(false)}>
                        <Modal.Header closeButton>
                        <Modal.Title>Give Assignment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ marginTop: '10px' }}><input ref={assignmentNameRef} type="text" placeholder="Enter assignment title"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assignmentDeadlineDateRef} type="text" placeholder="Enter deadline (MM/DD/YYYY)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assignmentTotalScoreRef} type="text" placeholder="Enter total score"></input></div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => changeGiveAssignment(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={setGiveAssignment}>
                            Add
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={announceAssessment} onHide={() => changeAnnounceAssessment(false)}>
                        <Modal.Header closeButton>
                        <Modal.Title>Announce Assessment</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ marginTop: '10px' }}><input ref={assessmentNameRef} type="text" placeholder="Enter Assessment Title"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assessmentDateRef} type="text" placeholder="Enter date (MM/DD/YYYY)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assessmentStartTimeRef} type="text" placeholder="Enter start time (HH:mm)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assessmentEndTimeRef} type="text" placeholder="Enter end time (HH:mm)"></input></div>
                            <div style={{ marginTop: '10px' }}><input ref={assessmentTotalPointsRef} type="text" placeholder="Enter total points"></input></div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={() => changeAnnounceAssessment(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={setAnnounceAssessment}>
                            Announce
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <div className="grid-container" style={{ width: '100%' }}>
                        <div style={{ display: 'table', height: '250px' }} onClick={() => changeScheduleMeeting(true)}>
                            <div className="grid-item">Schedule Meeting</div>
                        </div>
                        <div style={{ display: 'table', height: '250px' }} onClick={() => changeGiveAssignment(true)}>
                            <div className="grid-item">Give Assignment</div>
                        </div>
                        <div style={{ display: 'table', height: '250px' }} onClick={() => changeAnnounceAssessment(true)}>
                            <div className="grid-item">Announce Assessment</div>
                        </div>
                        <div style={{ display: 'table', height: '250px' }} onClick={() => null}>
                            <div className="grid-item">Give Assignment Scores</div>
                        </div>
                        <div style={{ display: 'table', height: '250px' }} onClick={() => null}>
                            <div className="grid-item">Give Assessment Scores</div>
                        </div>
                    </div>
                </div>
            </> : 
            <>
                <div className="w-100" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>
                    <Modal show={modelOpen} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Add as Todo</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div style={{ marginTop: '10px' }}><input ref={titleRef} type="text" placeholder="Enter title" /></div>
                            <div style={{ marginTop: '10px' }}><input ref={descRef} type="text" placeholder="Enter description" /></div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleAdd}>
                            Add
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <div 
                        style={{ width: '50%', minHeight: 'calc(100vh - 56px)', borderRight: '0.1pt solid grey' }}
                    >
                        <h2 style={{ textAlign: 'center' }}>Assignments</h2>
                        {assignments.map((a) => <div style={{ padding: '10px', border: '1px solid grey', margin: '20px', borderRadius: '5px' }}>
                            <h3>{`${a.assignmentName} (${a.totalScore} points)`}</h3>
                            <div>
                                <div>{`Deadline: ${new Date(a.deadlineDate).toDateString()}`}</div>
                                <div style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleShow}>Add Todo</div>
                            </div>
                        </div>)}
                    </div>
                    <div 
                        style={{ width: '50%', minHeight: 'calc(100vh - 56px)' }}
                    >
                        <h2 style={{ textAlign: 'center' }}>Assessments</h2>
                        {assessments.map((a) => <div style={{ padding: '10px', border: '1px solid grey', margin: '20px', borderRadius: '5px' }}>
                            <h3>{`${a.assessmentName} (${a.totalPoints} points)`}</h3>
                            <div>
                                <div>{`Test Date: ${new Date(a.date).toDateString()}`}</div>
                                <div>{`Start Time: ${a.startTime} IST`}</div>
                                <div>{`End Time: ${a.endTime} IST`}</div>
                            </div>
                        </div>)}
                    </div>
                </div>
            </>
        }
    </>;
}

export default SingleTrack;