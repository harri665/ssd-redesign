import { useEffect, useRef, useState, type FormEvent } from 'react'

const SHOPS: [string, string][] = [
  ['wood', 'Wood shop'],
  ['metal', 'Metal shop and welding'],
  ['ceramics', 'Ceramics studio'],
  ['electronics', 'Electronics lab'],
  ['3d', '3D printers'],
  ['textiles', 'Textiles'],
]

const MEMBERSHIPS: [string, string][] = [
  ['regular', 'Regular, $85 a month'],
  ['student', 'Student, senior or service member, $50 a month'],
  ['family', 'Family, $130 a month'],
  ['unsure', "I'm not sure yet"],
]

type FieldKey = 'name' | 'email' | 'phone' | 'membership'
type Errors = Partial<Record<FieldKey, string>>

function findErrors(form: HTMLFormElement): Errors {
  const errors: Errors = {}
  const field = (id: string) => form.querySelector<HTMLInputElement>(`#${id}`)!
  const name = field('name')
  const email = field('email')
  const phone = field('phone')
  if (name.validity.valueMissing) errors.name = 'Enter your name'
  if (email.validity.valueMissing) errors.email = 'Enter your email address'
  else if (email.validity.typeMismatch) errors.email = 'Enter an email address like name@example.com'
  if (phone.validity.patternMismatch) errors.phone = 'Enter a 10 digit phone number like 303-555-0123 or leave it blank'
  if (field('m-regular').validity.valueMissing) errors.membership = "Choose a membership or pick I'm not sure yet"
  return errors
}

const FIRST_INPUT: Record<FieldKey, string> = { name: 'name', email: 'email', phone: 'phone', membership: 'm-regular' }

export default function VisitForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const messageRef = useRef<HTMLDivElement>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const [tries, setTries] = useState(0)

  useEffect(() => {
    if (tries) messageRef.current?.focus()
  }, [tries])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const found = findErrors(form)
    setErrors(found)
    const ok = Object.keys(found).length === 0
    setSent(ok)
    if (ok) form.reset()
    setTries((n) => n + 1)
  }

  const problems = Object.entries(errors) as [FieldKey, string][]
  const invalid = (key: FieldKey) => (errors[key] ? 'true' : undefined)

  return (
    <>
      <div
        id="form-message"
        ref={messageRef}
        tabIndex={-1}
        className={problems.length ? 'error-summary' : sent ? 'success' : undefined}
      >
        {problems.length > 0 && (
          <>
            <h2>
              {problems.length === 1 ? 'There is 1 problem with the form' : `There are ${problems.length} problems with the form`}
            </h2>
            <ul>
              {problems.map(([key, text]) => (
                <li key={key}>
                  <a
                    href={`#${FIRST_INPUT[key]}`}
                    onClick={(event) => {
                      event.preventDefault()
                      document.getElementById(FIRST_INPUT[key])?.focus()
                    }}
                  >
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
        {sent && (
          <>
            <h2>Thanks, we will see you at the open house</h2>
            <p>This is a class project so nothing was actually sent. On the real site this would email the SSD admin team.</p>
          </>
        )}
      </div>

      <form className="form" id="visit-form" ref={formRef} noValidate onSubmit={handleSubmit}>
        <p>
          Fields marked <span className="req">required</span> must be filled in.
        </p>

        <div className="field">
          <label htmlFor="name">
            Your name <span className="req">required</span>
          </label>
          <input type="text" id="name" name="name" autoComplete="name" required aria-invalid={invalid('name')} aria-describedby="name-error" />
          <p className="error" id="name-error">{errors.name}</p>
        </div>

        <div className="field">
          <label htmlFor="email">
            Email address <span className="req">required</span>
          </label>
          <span className="hint" id="email-hint">We only use this to reply to you.</span>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            aria-invalid={invalid('email')}
            aria-describedby="email-hint email-error"
          />
          <p className="error" id="email-error">{errors.email}</p>
        </div>

        <div className="field">
          <label htmlFor="phone">Phone number</label>
          <span className="hint" id="phone-hint">Optional. Use 10 digits, like 303-555-0123.</span>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            pattern="\(?[0-9]{3}\)?[ .\-]?[0-9]{3}[ .\-]?[0-9]{4}"
            aria-invalid={invalid('phone')}
            aria-describedby="phone-hint phone-error"
          />
          <p className="error" id="phone-error">{errors.phone}</p>
        </div>

        <fieldset className="field" aria-describedby="membership-error">
          <legend>
            Which membership are you interested in? <span className="req">required</span>
          </legend>
          {MEMBERSHIPS.map(([value, label]) => (
            <div className="choice" key={value}>
              <input
                type="radio"
                id={`m-${value}`}
                name="membership"
                value={value}
                required={value === 'regular'}
                aria-invalid={invalid('membership')}
              />
              <label htmlFor={`m-${value}`}>{label}</label>
            </div>
          ))}
          <p className="error" id="membership-error">{errors.membership}</p>
        </fieldset>

        <fieldset className="field" aria-describedby="shops-hint">
          <legend>Which shops do you want to use?</legend>
          <span className="hint" id="shops-hint">Optional. Pick as many as you want.</span>
          {SHOPS.map(([value, label]) => (
            <div className="choice" key={value}>
              <input type="checkbox" id={`s-${value}`} name="shops" value={value} />
              <label htmlFor={`s-${value}`}>{label}</label>
            </div>
          ))}
        </fieldset>

        <div className="field">
          <label htmlFor="access">Is there anything we can do to make your visit easier?</label>
          <span className="hint" id="access-hint">
            Optional. For example, if you use a wheelchair and want to know about parking and the entrance.
          </span>
          <textarea id="access" name="access" maxLength={1000} aria-describedby="access-hint" />
        </div>

        <button className="button" type="submit">
          Send my visit plan
        </button>
      </form>
    </>
  )
}
