import Icon from '@/components/Icons/Icon'

Icon.register({
    'wmts': {
        'width': 24,
        'height': 24,
        'raw': `
            <path fill="none" stroke-miterlimit="10" d="M0,0L1.5,24L3,0L4.5,24L6,0 M6,24L7.5,0L9,24L10.5,0L12,24 M12,0L18,0 M15,0L15,24 M24,0C18,0,18,12,21,12 C24,12,24,24,18,24" />`
        , 'g': {
            'stroke': 'currentColor',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        }
    }
})