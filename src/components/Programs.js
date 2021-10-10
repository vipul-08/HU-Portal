import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { database } from "../firebase";
import '../global.css';

function Programs() {

    const history = useHistory();
    const { currentUser } = useAuth();
    const [programs, setPrograms] = useState([]);

    useEffect(() => {
        let prgms = [];
        database.ref().child('Users').child(currentUser.uid).child('Programs').once('value', async (snapshot) => {
            snapshot.forEach(async (element) => {
                let processed = 0;
                await database.ref().child('Programs').child(element.key).once('value', (s) => {
                    prgms = [...prgms, s.val()];
                    processed += 1;
                    if (processed === Object.keys(snapshot.val()).length)
                        setPrograms(prgms);
                });
            });
        });

    },[]);


    const gotoProgram = (pid) => {
        history.push(`${history.location.pathname}/${pid}`);
    }

    return (<>
        <div className="w-100" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>
            <div className="grid-container" style={{ width: '100%' }}>
                {programs.map((program) => <div style={{ display: 'table', height: '250px' }} onClick={() => gotoProgram(program.programId)}>
                    <div className="grid-item">{program.programName}</div>
                </div>)}
            </div>
        </div>
    </>)
}

export default Programs;