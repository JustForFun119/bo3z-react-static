import React from 'react'
import Responsive from 'react-responsive'

export const Tablet = {
    MaxWidth: 992
}
export const Mobile = {
    MaxWidth: 768
}
export const MobileXs = {
    MaxWidth: 425
}

export const getScreenSize = () => {
    return window.innerWidth < MobileXs.MaxWidth ? 'MobileXs' :
        window.innerWidth < Mobile.MaxWidth ? 'Mobile' :
            window.innerWidth < Tablet.MaxWidth ? 'Tablet' : 'Desktop'
}

const responsive = {
    Desktop: ({ children }) => <Responsive minWidth={Tablet.MaxWidth} children={children} />,
    Tablet: ({ children }) => <Responsive minWidth={Mobile.MaxWidth} maxWidth={Tablet.MaxWidth} children={children} />,
    Mobile: ({ children }) => <Responsive minWidth={MobileXs.MaxWidth} maxWidth={Mobile.MaxWidth} children={children} />,
    MobileXs: ({ children }) => <Responsive maxWidth={MobileXs.MaxWidth} children={children} />
}

export default responsive