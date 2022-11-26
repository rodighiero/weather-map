import { select } from 'd3'

const space = '&nbsp;'
const line = '—————————————'
const block = '<span class="block"></span>'


export function click(e) {

    select('#focus').remove()

    const focus = select('body').append('div').attr('id', 'focus')


    // Heading

    focus.append('h1').html(e.name)
    focus.append('h2').html(`<a href= https://en.wikipedia.org/wiki/Special:Search/${encodeURIComponent(e.name)} target="_blank">Search on Wikipedia</a>`)
    focus.append('h2').html('Frequency: ' + e.frequency)
    focus.append('h2').html('Trend: ' + Number(e.slope).toFixed(2))


    // Frequency by Year

    focus.append('p').html(space)
    focus.append('h2').html('Frequency by Year')
    focus.append('p').html(line)

    Object.entries(e.years_JSON)
        .forEach(([key, value]) => {
            const blocks = block.repeat(value)
            focus.append('p').html(`${key}&#9${blocks}`)
        })

    // URLs

    focus.append('p').html(space)
    focus.append('h2').html(`10/${e.urls.length} Random URLs`)
    focus.append('p').html(line)

    e.urls
        .slice(0, 10) // Get first 10 URLs
        // .sort(() => Math.random() - Math.random()).slice(0, 10) // Get 10 random URLs
        .forEach(url => {
            focus.append('p').html(`<a href='${url}' target="_blank">${url} </a>`)
        })

}