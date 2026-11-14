import { Link } from 'react-router-dom'
import { usePage } from '../usePage.ts'
import { CALENDAR, HOME, MEETUP, SSD } from '../links.ts'

const EVENTS = [
  {
    when: ['Every Thursday', '5 to 6 pm'],
    title: 'Makerspace Open House and Tours',
    text: 'Tour the space, meet members and ask questions. Walk-ins are welcome, and new members get their safety briefing here.',
    rsvp: true,
  },
  {
    when: ['Every Tuesday', '6 to 9 pm'],
    title: 'Black Knights Robotics Team Meeting',
    text: 'The Black Knights high school FIRST Robotics team meets and builds at the space.',
  },
  {
    when: ['First Wednesday of the month', '7 to 8:30 pm'],
    title: 'Monthly Board Meeting',
    text: 'The SSD board meets to talk about the space, the budget and upcoming projects.',
  },
  {
    when: ['Second Sunday of the month', '1 pm'],
    title: 'D&D Tabletop Session',
    text: 'A monthly Dungeons and Dragons game at the space.',
  },
]

const CAL_SRC =
  'https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FDenver&showTitle=0&mode=AGENDA' +
  '&src=Ym91bGRlcmhhY2tlcnNwYWNlQGdtYWlsLmNvbQ' +
  '&src=MTdiMWQzMzM1MmZhNDg3NmU3NmVjN2I5Y2ZmYTUzODM5YTFkMWI4YjM2Mjk3N2Q3NDg1Y2M3ZGY4NjE1OTQzY0Bncm91cC5jYWxlbmRhci5nb29nbGUuY29t' +
  '&src=bW5pMDFrN2QzaTZkYjc3bjk0cXR0dDA4cGFuNTZjZzdAaW1wb3J0LmNhbGVuZGFyLmdvb2dsZS5jb20' +
  '&color=%237cb342&color=%239e69af&color=%239e69af'

export default function Calendar() {
  const h1Ref = usePage('Calendar | Solid State Depot')

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to={HOME}>Home</Link></li>
              <li><Link to={CALENDAR} aria-current="page">Calendar</Link></li>
            </ol>
          </nav>
          <h1 ref={h1Ref} tabIndex={-1}>Calendar</h1>
          <p>
            Here is what is happening at the makerspace. Some events have a size limit, so please RSVP on Meetup if you
            plan to come.
          </p>
        </div>
      </div>

      <section className="section" aria-labelledby="regular">
        <div className="wrap">
          <h2 id="regular">Regular events</h2>
          <ul className="event-list">
            {EVENTS.map((event) => (
              <li className="event" key={event.title}>
                <p className="when">
                  {event.when[0]}
                  <br />
                  {event.when[1]}
                </p>
                <div>
                  <h3>{event.title}</h3>
                  <p>{event.text}</p>
                  {event.rsvp && (
                    <p>
                      <a href={MEETUP}>RSVP for the open house on Meetup</a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section alt" aria-labelledby="classes">
        <div className="wrap">
          <h2 id="classes">Classes and one time events</h2>
          <p className="intro">
            Classes, workshops and events like repair clinics are posted on our Meetup group. That is also where you RSVP.
          </p>
          <a className="button" href={MEETUP}>See classes and events on Meetup</a>
        </div>
      </section>

      <section className="section" aria-labelledby="full-calendar">
        <div className="wrap">
          <h2 id="full-calendar">Full calendar</h2>
          <p>The Google Calendar below shows every event, plus times when a shop is closed, like kiln firing days.</p>
          <p>
            <a href="#after-calendar">Skip past the calendar</a>
          </p>
          <iframe className="calendar-frame" title="Solid State Depot events Google Calendar" src={CAL_SRC} />
          <p id="after-calendar" tabIndex={-1}>
            If the calendar doesn&apos;t load, you can{' '}
            <a href="https://calendar.google.com/calendar/embed?src=boulderhackerspace%40gmail.com&ctz=America%2FDenver">
              open the calendar in Google Calendar
            </a>
            .
          </p>
        </div>
      </section>

      <section className="section alt" aria-labelledby="teach">
        <div className="wrap">
          <h2 id="teach">Want to teach a class?</h2>
          <p className="intro">
            Members teach everything from welding to sewing. If you have a skill to share, we can help you set up a class.
          </p>
          <a className="button" href={SSD + '?page_id=1367'}>Teach a class</a>
        </div>
      </section>
    </>
  )
}
