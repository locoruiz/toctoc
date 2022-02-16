import { useState, useEffect } from 'react';

export default () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', (w, e) => {
            setWidth(window.innerWidth);
        })
        return () => {
            window.removeEventListener('resize')
        }
    }, [])

    return width;
}