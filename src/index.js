// @flow
/* eslint-disable class-methods-use-this */


export type AppId = number
export type AppSecret = string

export interface SoftSession {
  token: string,
}

export interface SessionRequest {
  prepareToken: string,
  appId: AppId,
}

export type Signed<M, S> = { m: M, s: S }

export class Issuer {
  prepareToken: string = ''

  prepareSession(session: SoftSession) {
    this.prepareToken = session.token
  }

  createSessionRequest(): Signed<SessionRequest, 'IssuerSecret'> {
    return {
      m: {
        prepareToken: this.prepareToken,
        appId: 1,
      },
      s: 'IssuerSecret',
    }
  }
}

export class Provider {
  createSession(): SoftSession {
    return {
      token: Math.floor(Math.random() * 100000).toString(16),
    }
  }

  acceptSessionRequest(request: Signed<SessionRequest, 'IssuerSecret'>) {
    const rawRequest = request.m

    if (request.s === 'IssuerSecret') {
      // valid signature
    }
    else {
      throw new Error('Signature invalid')
    }
  }
}


// eslint-disable-next-line no-unused-vars
function test() {
  const issuer = new Issuer()
  const provider = new Provider()

  // request new session
  const softSession = provider.createSession()
  issuer.prepareSession(softSession)

  const request = issuer.createSessionRequest()
  // redirect user to "allow-access-to-app" provider page with request token
  provider.acceptSessionRequest(request)
}
