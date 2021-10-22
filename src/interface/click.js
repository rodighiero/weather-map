import { select } from 'd3'

const space = '&nbsp;'
const line = '—————————————'
const block = '<span class="block"></span>'


export function click(node) {

    console.log('Click')

    select('#focus').remove()
    // s.tokens = []

    const focus = select('body').append('div').attr('id', 'focus')

    // Heading

    focus.append('h2').html('Name: ' + node.name)
    focus.append('h3').html('Index: ' + node.index)
    focus.append('h3').html('Occurrence: ' + node.occurrence)
    focus.append('p').html('Regression: ' + Number(node.regression).toFixed(2))

    // Frequency

    focus.append('p').html(space)
    focus.append('h3').html('Frequency:')
    focus.append('p').html(line)
    Object.entries(node.frequency)
        .forEach(([key, value]) => {
            const blocks = block.repeat(value)
            focus.append('p').html(`${key}&#9${blocks}`)
        })

    // URLs

    focus.append('p').html(space)
    focus.append('h3').html('URLs: ' + node.urls.length + ' (max twenty random)')
    focus.append('p').html(line)
    node.urls
        .sort(() => Math.random() - Math.random()).slice(0, 20) // Get 20 random URLs
        .forEach((url, index) => {
            focus.append('p').html(`<a href='${url}' target="_blank">${url} </a>`)
        })

}