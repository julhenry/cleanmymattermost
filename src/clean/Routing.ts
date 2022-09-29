interface Route {
    path: string
    label: string
}
export const Routes: {[name: string]: Route} = {
    home: {
        path: '/clean',
        label: 'Clean',
    },
}