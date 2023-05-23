import { injectServer } from './dependency-injector'

const init = async () => {
  const server = injectServer()

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()
