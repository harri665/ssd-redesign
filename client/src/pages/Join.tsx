import { Link } from 'react-router-dom'
import { usePage } from '../usePage.ts'
import VisitForm from '../VisitForm.tsx'
import { APPLY, EMAIL, HOME, JOIN } from '../links.ts'

export default function Join() {
  const h1Ref = usePage('Join SSD | Solid State Depot')

  return (
    <>
      <div className="page-head">
        <div className="wrap">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to={HOME}>Home</Link></li>
              <li><Link to={JOIN} aria-current="page">Join SSD</Link></li>
            </ol>
          </nav>
          <h1 ref={h1Ref} tabIndex={-1}>Join SSD</h1>
          <p>We are excited that you want to join Solid State Depot. Here is what it costs and how to sign up.</p>
        </div>
      </div>

      <section className="section" aria-labelledby="dues">
        <div className="wrap">
          <h2 id="dues">Monthly dues</h2>
          <table className="dues">
            <caption className="visually-hidden">Solid State Depot monthly membership dues</caption>
            <thead>
              <tr>
                <th scope="col">Membership</th>
                <th scope="col">Price per month</th>
              </tr>
            </thead>
            <tbody>
              <tr><th scope="row">Regular</th><td>$85</td></tr>
              <tr><th scope="row">Student, senior or service member</th><td>$50</td></tr>
              <tr><th scope="row">Family (2 people in the same household)</th><td>$130</td></tr>
            </tbody>
          </table>
          <p>
            You can pay by credit or debit card, cash, or check made out to Solid State Depot. Every membership includes
            24/7 access to all of the shops.
          </p>
        </div>
      </section>

      <section className="section alt" aria-labelledby="steps">
        <div className="wrap">
          <h2 id="steps">How to join</h2>
          <ol className="steps">
            <li><strong>Fill out the membership application.</strong> It is on our membership site, Wild Apricot.</li>
            <li>
              <strong>Come to a Thursday open house</strong> from 5 to 6 pm. You will meet the admin team, sign the
              membership agreement, liability release and rules, and get a safety briefing.
            </li>
            <li><strong>Get your key fob.</strong> Once a volunteer approves your membership, you can use the space any time.</li>
          </ol>
          <p>
            Can&apos;t make it on a Thursday? <a href={`mailto:${EMAIL}`}>Email us</a> and we will set up another time.
          </p>
          <a className="button" href={APPLY}>Start your application on Wild Apricot</a>
        </div>
      </section>

      <section className="section" aria-labelledby="plan">
        <div className="wrap">
          <h2 id="plan">Plan your first visit</h2>
          <p className="intro">
            Not ready to apply yet? Tell us you are coming to an open house and we will have someone ready to show you around.
          </p>
          <VisitForm />
        </div>
      </section>
    </>
  )
}
