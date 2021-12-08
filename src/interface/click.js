import { select } from 'd3'

const space = '&nbsp;'
const line = '—————————————'
const block = '<span class="block"></span>'


export function click(e) {

    select('#focus').remove()

    const focus = select('body').append('div').attr('id', 'focus')


    // Heading

    focus.append('h1').html(e.name)
    focus.append('h2').html(`<a href= https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(e.name)} target="_blank">Open Wikipedia Page</a>`)
    focus.append('h2').html('Frequency: ' + e.frequency)
    focus.append('h2').html('Linear Regression: ' + Number(e.slope).toFixed(2))


    // Frequency by Year

    focus.append('p').html(space)
    focus.append('h2').html('Years:')
    focus.append('p').html(line)

    Object.entries(e.years_JSON)
        .forEach(([key, value]) => {
            const blocks = block.repeat(value)
            focus.append('p').html(`${key}&#9${blocks}`)
        })

    // URLs

    focus.append('p').html(space)
    focus.append('h2').html('20 Random URLs of ' + e.urls.length)
    focus.append('p').html(line)

    e.urls
        .sort(() => Math.random() - Math.random()).slice(0, 20) // Get 20 random URLs
        .forEach( url => {
            focus.append('p').html(`<a href='${url}' target="_blank">${url} </a>`)
        })

}