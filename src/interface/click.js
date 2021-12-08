import { select } from 'd3'

const space = '&nbsp;'
const line = '—————————————'
const block = '<span class="block"></span>'


export function click(e) {

    select('#focus').remove()
    // s.tokens = []

    const focus = select('body').append('div').attr('id', 'focus')

    // Heading

    focus.append('h2').html('Name: ' + e.name)
    // focus.append('h2').html(`<a href=https://en.wikipedia.org/w/index.php?title=Special:Search&search='${encodeURIComponent(e['name'])}' target="_blank">Wikipedia search</a>`)
    focus.append('h3').html('Frequency: ' + e.frequency)
    focus.append('p').html('Linear Regression: ' + Number(e.slope).toFixed(2))

    // https://en.wikipedia.org/w/index.php?title=Special:Search&search=IMB&ns0=1

    

    // Frequency

    focus.append('p').html(space)
    focus.append('h3').html('Years:')
    focus.append('p').html(line)

    Object.entries(e.years_JSON)
        .forEach(([key, value]) => {
            const blocks = block.repeat(value)
            focus.append('p').html(`${key}&#9${blocks}`)
        })

    // URLs

    focus.append('p').html(space)
    focus.append('h3').html('URLs: ' + e.urls.length + ' (max ten random)')
    focus.append('p').html(line)

    e.urls
        .sort(() => Math.random() - Math.random()).slice(0, 10) // Get 20 random URLs
        .forEach( url => {
            focus.append('p').html(`<a href='${url}' target="_blank">${url} </a>`)
        })

}