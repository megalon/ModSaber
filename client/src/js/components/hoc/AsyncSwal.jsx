import asyncComponent from './AsyncComponent'

const AsyncSwal = asyncComponent(() => import('sweetalert2-react'))
export default AsyncSwal
