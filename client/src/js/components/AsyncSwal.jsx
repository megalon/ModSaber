import asyncComponent from './AsyncComponent.jsx'

const AsyncSwal = asyncComponent(() => import('sweetalert2-react'))
export default AsyncSwal
