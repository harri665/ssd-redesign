import { Link } from 'react-router-dom'
import { usePage } from '../usePage.ts'
import { HOME, SSD } from '../links.ts'

export default function NotFound() {
  const h1Ref = usePage('Page not found | Solid State Depot')

  return (
    <div className="page-head">
      <div className="wrap">
        <h1 ref={h1Ref} tabIndex={-1}>
          Page not found
        </h1>
        <p>
          I only rebuilt a few pages of the site. Go back to the <Link to={HOME}>home page</Link> or visit the{' '}
          <a href={SSD}>real SSD website</a>.
        </p>
      </div>
    </div>
  )
}
