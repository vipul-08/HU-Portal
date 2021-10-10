/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Calendar } from "@natscale/react-calendar"
import '@natscale/react-calendar/dist/main.css';
import { database } from "../firebase"


export default function Dashboard() {
  const [calendarValue, changeCalender] = useState(new Date());
  const { currentUser } = useAuth()

  const [todos, setTodos] = useState([]);

  const [events, setEvents] = useState([]);

  const dates = useMemo(() => {
    let repeatArray =  [];
    return events.reduce((a,c) => {
      if (repeatArray.includes(new Date(c.date).toLocaleDateString())) {
        return a;
      }
      repeatArray = [...repeatArray, new Date(c.date).toLocaleDateString()];
      return [...a, new Date(c.date)];
    } ,[])
  }, [events]);

  const showEvents = useMemo(() => {
    return events.reduce((a,c) => calendarValue.toLocaleDateString() === new Date(c.date).toLocaleDateString() ? [...a,c] : a ,[])
  }, [events, calendarValue])
  
  const onChange = useCallback(
    (value) => {
      changeCalender(value);
    },
    [changeCalender],
  );

  const fetchTodos = () => {
    database.ref().child("Users").child(currentUser.uid).child('Programs').once('value', (snapshot) => {
      let processed = 0;
      let tds = [];
      const total = Object.keys(snapshot.val()).length;
      snapshot.forEach(element => {
        processed += 1;
        if (element.val().todos && Object.keys(element.val().todos).length > 0) {
          Object.keys(element.val().todos).map((k) => {
            tds = [...tds, {...element.val().todos[k], todoId: k, programId: element.key}];
            return 0;
          });
        }

        if (processed === total) {
          setTodos(tds);
        }

      });
    })
  }

  const fetchCalenderItems = () => {
    database.ref().child("Users").child(currentUser.uid).child('Programs').once('value', (snapshot) => {
      let processed = 0;
      const total = Object.keys(snapshot.val()).length;
      let evnts = [];
      snapshot.forEach((element) => {
        database.ref().child("Programs").child(element.key).child("tracks").once('value', (tracksSnapshot) => {
          processed += 1;
          const tracks = tracksSnapshot.val();
          Object.keys(tracks).forEach((trackId) => {
            const events = tracks[trackId].events;
            if (events && Object.keys(events).length > 0) {
              Object.keys(events).forEach((eventId) => {
                evnts = [...evnts, events[eventId]];
              })
            }
          });
          if (processed === total) {
            setEvents(evnts);
          }
        })
      })


    });
  }

    useEffect(() => {
      fetchTodos();
      fetchCalenderItems();
    }, []);

    const removeTodo = (todoId, programId) => {
      database.ref().child("Users").child(currentUser.uid).child('Programs').child(programId).child('todos').child(todoId).remove().then(() => {
        fetchTodos();
      });
    }

  return (
    <div className="w-100" style={{ display: 'flex', minHeight: 'calc(100vh - 56px)', marginTop: '56px' }}>
      <div 
        style={{ width: 'calc(100% - 550px)', minHeight: 'calc(100vh - 56px)', borderRight: '0.1pt solid grey' }}
      >
        {(showEvents == null || showEvents.length === 0) ? <div style={{ height: '100%', width: '100%', display: 'table' }}>
          <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>No Events</div>
        </div> : null}
        {showEvents && showEvents.map((s) => <div style={{ border: '1px solid grey', margin: '10px', padding: '10px', borderRadius: '5px', position: 'relative' }}>
          <h3>{s.eventName}</h3>
          <div>{`Date: ${new Date(s.date).toDateString()}`}</div>
          <div>{`Start Time: ${s.startTime} IST`}</div>
          <div>{`End Time: ${s.endTime} IST`}</div>
          <div><a href={s.eventLink} target="_blank">Join Meeting</a></div>
        </div>)}
      </div>
      
      <div style={{ width: '550px', minHeight: 'calc(100vh - 56px)', paddingTop: '30px', paddingLeft: '20px' }}>
        <Calendar
          size="350"
          startOfWeek="1"
          disablePast
          value={calendarValue}
          onChange={onChange}
          highlights={dates}
        />

        <div style={{ marginTop: '30px', width: '100%', textAlign: 'start' }}>
          <h3>My TODOs</h3>
          {todos.map((t) => <div className="todo" style={{ border: '1px solid grey', margin: '10px', padding: '10px', borderRadius: '5px', position: 'relative' }}>
            <span onClick={() => removeTodo(t.todoId, t.programId)} style={{ position: 'absolute', top: '1px', right: '1px', cursor: 'pointer' }}>❌</span>
            <h5 className="todo-title">{`- ${t.todoTitle}`}</h5>
            <div className="todo-description">{t.todoDescription}</div>
          </div>)}
        </div>
      </div>

    </div>
  )
}
