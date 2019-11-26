[![Node.js Wrapper for AGL APIs](https://pluralsight.imgix.net/paths/path-icons/nodejs-601628d09d.png)]

The easiest way to use the [AGL](http://www.agl.com.au) APIs in your [node.js](http://nodejs.org/) applications.


Objective:

1. generic node js with less dependency on any package
2. provide transparency about using AGL APIs and object structures used in those APIs
3. easy to integrate with existing nodejs app
4. easy to deploy with existing nodejs app
5. gitlabs CI/CD friendly
6. es5 and es6 syntax friendly
7. provide scalability and security and compatibility
8. versioning

=======================================================================

Dependencies:

* Docker: https://docs.docker.com/v17.09/engine/installation/linux/docker-ce/ubuntu/#install-using-the-convenience-script
* Docker Compose: https://docs.docker.com/compose/install/

How do I use it for test?

Go to one of versions under the root directory, run `docker-compose up -d`.
Open your browser, type `http://localhost:3000`, you should be able to see a list of cats as required format

There are unit tests (nock) and integration tests available for the test, how to run them?

Go to one of versions under the root directory, run `docker-compose exec app bash`
Run `npm run test` to run both tests, or run `npm run test-unit` for unit testing, or run `npm run test-integration` for integration testing

Other Considerations:

1. Security mechanism should be implementd for source API, signing the request on App side the reach maximium security. 
2. Views are implemented to display the data from source API according to requirement, it shouldn't be there for simplicity of this SDK
3. Provide different implementation to suit differnt response handling method for parent application, such as callback, promise and async/await. 
4. Add Typescript support besides ES5, ES6.
5. Add more unit tests scenarios 





