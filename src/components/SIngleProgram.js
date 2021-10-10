import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../firebase";

function SingleProgram() {
    const history = useHistory();

    const { programId } = useParams();
    const {currentUser} = useAuth();
    
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        let trcks = [];
        database.ref().child('Programs').child(programId).child('tracks').once('value', async (snapshot) => {

            let processed = 0;
            await database.ref().child('Users').child(currentUser.uid).child('Programs').child(programId).child('trainer').once('value', (v) => {
                if(v.val() === false) {
                    snapshot.forEach((element) => {
                        processed += 1;
                        trcks = [...trcks, element.val()];
                        if (processed === Object.keys(snapshot.val()).length) {
                            setTracks(trcks);
                        }
                    });

                } else {
                    snapshot.forEach((element) => {
                        processed += 1;
                        if (element.val().trackLeadId === currentUser.uid || element.val().trackHelpers.includes(currentUser.uid)) {
                            trcks = [...trcks, element.val()];
                        }
                        if (processed === Object.keys(snapshot.val()).length) {
                            setTracks(trcks);
                        }
                    });
                }
            });
        });

    },[]);

    const gotoTrack = (tid) => {
        history.push(`${history.location.pathname}/track/${tid}`);
    }

    return (<>
        <div className="w-100" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>
            <div className="grid-container" style={{ width: '100%' }}>
                {tracks.map((track) => <div style={{ display: 'table', height: '250px' }} onClick={() => gotoTrack(track.trackId)}>
                    <div className="grid-item">{track.trackName}</div>
                </div>)}
            </div>
        </div>
    </>)
}

export default SingleProgram;