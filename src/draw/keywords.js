import { BitmapText, Graphics } from 'pixi.js'
import { descending, mean } from 'd3'

export default entities => {

    const stage = new Graphics()
    stage.name = 'keywords'
    stage.interactiveChildren = false
    s.viewport.addChild(stage)

    let harvest = [] // Collector for visible keywords

    // console.log(entities.length)

    entities
        .filter(e => e['type'] === 'subject') // Keep keywords
        .forEach(e => {

            const bitmap = new BitmapText(
                e['name'],
                {
                    fontName: 'Lato',
                    fontSize: parseFloat(e['frequency_norm']) + .6,
                    tint: 0x999999,
                    align: 'center',
                })

            bitmap.scale.set(16)
            bitmap.position.set(e['x'] - bitmap.width / 2, e['y'] - bitmap.height / 2)


            // Check overlapping

            let overlapping = false

            for (var i = 0; i < harvest.length; i++) {

                const l1 = harvest[i]
                const l2 = bitmap
                const margin = 10 // Important to correct shorter height

                if (!(l2.x > l1.x + l1.width + margin
                    || l2.x + l2.width + margin < l1.x
                    || l2.y > l1.y + l1.height + margin
                    || l2.y + l2.height + margin < l1.y)) {
                    overlapping = true // This is black magic
                    break
                }

            }

            if (!overlapping) {

                stage.addChild(bitmap)
                harvest.push(bitmap)

                // const rectangle = new Graphics(); // Draw contour to verify
                // rectangle.lineStyle(.5, 0xFFFFFF, .6)
                // rectangle.beginFill(0xFFFFFF, 0.1)
                // rectangle.drawRoundedRect(bitmap.x, bitmap.y, bitmap.width, bitmap.height, 1)
                // rectangle.endFill()
                // stage.addChild(rectangle)

            }

        })

}
