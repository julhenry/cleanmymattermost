interface Route {
    path: string
    label: string
}
export const Routes: {[name: string]: Route} = {
    home: {
        path: '/config',
        label: 'Home',
    },
}