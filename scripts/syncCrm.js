import {User} from 'src/server/services/dataService'
import {connect} from 'src/db'
import syncUserWithCRM from 'src/server/actions/syncUserWithCRM'
import syncUserEmailWithCRMEmail from 'server/actions/syncUserEmailWithCRMEmail'

const r = connect()

User.filter(r.row.hasFields('hubspotId').not()).run()
  .then(users => {
    return Promise.all(
      users.map(user => syncUserWithCRM(user))
      .map(promise => promise.catch(error => console.error(error)))
    )
  })
  .then(() => {
    User.run()
      .then(users => {
        users.forEach(user => {
          syncUserEmailWithCRMEmail(user)
            .catch(error => console.error(error))
        })
      })
  })
