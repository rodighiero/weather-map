import { BitmapText, Graphics } from 'pixi.js'
import { descending, mean } from 'd3'

export default data => {

    const stage = new Graphics()
    stage.name = 'keywords_distant'
    stage.interactiveChildren = false
    s.viewport.addChild(stage)

    let harvest = [] // Collector for visible keywords

    const color = 0xFFFFFF // White
    // const color = 0x000000 // Black
    const limit = mean(data.map(d => d[2])) / 2 // Limit for filering smaller keywords

    data
        .filter(el => el[3].charAt(0) === el[3].charAt(0).toLowerCase()) // Keep keywords
        // .filter(el => el[2] > limit) // Keep most relevant keywords
        .sort((a, b) => descending(a[2], b[2])) // Order by weight
        .forEach(el => {

            const x = el[0]
            const y = el[1]
            const weight = el[2]
            const name = el[3]

            const bitmap = new BitmapText(
                name,
                {
                    fontName: 'Lato',
                    fontSize: '64',
                    tint: color,
                    align: 'center',
                })

            const baseWeight = 200
            const magnitude = .0005

            bitmap.scale.set((baseWeight + weight) * magnitude)
            bitmap.position.set(x - bitmap.width / 2, y - bitmap.height / 2)


            // Check overlapping

            let overlapping = false

            for (var i = 0; i < harvest.length; i++) {

                const l1 = harvest[i]
                const l2 = bitmap
                const margin = 5 // Important to correct shorter height

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

                // Overlapping check

                // const rectangle = new Graphics();
                // rectangle.lineStyle(.5, 0xFFFFFF, .6)
                // rectangle.beginFill(0xFFFFFF, 0.1)
                // rectangle.drawRoundedRect(bitmap.x, bitmap.y, bitmap.width, bitmap.height, 1)
                // rectangle.endFill()
                // stage.addChild(rectangle)

            }

        })

}
