import React from 'react'
import { ReactComponent as HorseIcon } from './svg/Horse.svg'
import { ReactComponent as ZebraIcon } from './svg/Zebra.svg'
import { ReactComponent as DonkeyIcon } from './svg/Donkey.svg'
import { ReactComponent as ElephantIcon } from './svg/Elephant.svg'
import { ReactComponent as UnicornIcon } from './svg/Unicorn.svg'
import { ReactComponent as MoreIcon } from './svg/MoreDots.svg'
import { ReactComponent as DiagramIcon } from './svg/Diagram.svg'

const equusItem = {
  tag: 'equus',
  title: '🐴',
  contents: (
    <div>
      Horses can sleep both lying down and standing up. Domestic horses have a
      lifespan of around 25 years. A 19th century horse named 'Old Billy' is
      said to have lived 62 years.
    </div>
  )
}

const elephantusItem = {
  tag: 'elephantus',
  title: '🐘',
  contents: (
    <div>
      Elephants are mammals of the family Elephantidae and the largest existing
      land animals. Three species are currently recognised: the African bush
      elephant, the African forest elephant, and the Asian elephant.
    </div>
  )
}

const unicornisItem = {
  tag: 'unicornis',
  title: '🦄',
  contents: (
    <div>
      If you’re looking to hunt a unicorn, but don’t know where to begin, try
      Lake Superior State University in Sault Ste. Marie, Michigan. Since 1971,
      the university has issued permits to unicorn questers.
    </div>
  )
}

export const items = [equusItem, elephantusItem, unicornisItem]

export const nestedItems = [
  equusItem,
  {
    tag: 'cladogram',
    icon: <DiagramIcon width="100%" height="2em" />,
    title: 'classification',
    items: [
      {
        icon: <DonkeyIcon width="100%" height="1.5em" />,
        title: 'donkeys (E.africanus)',
        items: [
          {
            icon: <DonkeyIcon width="100%" height="1.5em" />,
            title: 'africanus',
            contents: (
              <div>
                The Nubian wild ass (Equus africanus africanus) is the nominate
                subspecies of African wild ass, and one of the ancestors of the
                domestic donkey, which was domesticated about 6,000 years ago.
                It is presumed to be extinct, though two populations potentially
                survive on the Caribbean island of Bonaire and in Gebel Elba.
              </div>
            )
          },
          {
            icon: <DonkeyIcon width="100%" height="1.5em" />,
            title: 'somaliensis',
            contents: (
              <div>
                The Somali wild ass (Equus africanus somaliensis) is a
                subspecies of the African wild ass. It is found in Somalia, the
                Southern Red Sea region of Eritrea, and the Afar Region of
                Ethiopia. The legs of the Somali wild ass are striped,
                resembling those of its relative, the zebra.
              </div>
            )
          }
        ]
      },
      {
        icon: <HorseIcon width="100%" height="1.5em" />,
        title: 'horses (E.ferus)',
        items: [
          {
            icon: <HorseIcon width="100%" height="1.5em" />,
            title: 'caballus',
            contents: (
              <div>
                The horse (Equus ferus caballus) is one of two extant subspecies
                of Equus ferus. It is an odd-toed ungulate mammal belonging to
                the taxonomic family Equidae. The horse has evolved over the
                past 45 to 55 million years from a small multi-toed creature,
                Eohippus, into the large, single-toed animal of today.
              </div>
            )
          },
          {
            icon: <HorseIcon width="100%" height="1.5em" />,
            title: 'ferus',
            contents: (
              <div>
                The tarpan (Equus ferus ferus), also known as Eurasian wild
                horse, was a subspecies of wild horse. It is now extinct. The
                last individual believed to be of this subspecies died in
                captivity in the Russian Empire during 1909, although some
                sources claim that it was not a genuine wild horse due to its
                resemblance to domesticated horses.
              </div>
            )
          },
          {
            icon: <HorseIcon width="100%" height="1.5em" />,
            title: 'przewalski',
            contents: (
              <div>
                Przewalski's horse, Equus przewalskii or Equus ferus
                przewalskii, also called the takhi, Mongolian wild horse or
                Dzungarian horse, is a rare and endangered horse native to the
                steppes of central Asia.
              </div>
            )
          }
        ]
      },
      {
        icon: <ZebraIcon width="100%" height="1.5em" />,
        title: 'zebras',
        items: [
          {
            icon: <ZebraIcon width="100%" height="1.5em" />,
            title: 'E.zebra',
            contents: (
              <div>
                The mountain zebra (Equus zebra) is a zebra species in the
                family Equidae. It is native to south-western Angola, Namibia,
                and South Africa.
              </div>
            )
          },
          {
            icon: <ZebraIcon width="100%" height="1.5em" />,
            title: 'E.quagga',
            contents: (
              <div>
                The plains zebra (Equus quagga, formerly Equus burchellii), also
                known as the common zebra, is the most common and geographically
                widespread species of zebra. Its range is fragmented, but spans
                much of southern and eastern Africa south of the Sahara.
              </div>
            )
          },
          {
            icon: <ZebraIcon width="100%" height="1.5em" />,
            title: 'E.grevyi',
            contents: (
              <div>
                The Grévy's zebra (Equus grevyi), also known as the imperial
                zebra, is the largest living wild equid and the largest and most
                threatened of the three species of zebra, the other two being
                the plains zebra and the mountain zebra. Named after Jules
                Grévy, it is found in Kenya and Ethiopia.
              </div>
            )
          }
        ]
      },
      {
        title: (
          <span
            style={{ fontSize: '75%', fontStyle: 'italic', fontWeight: 'bold' }}
          >
            Attribution: Wikipedia
          </span>
        ),
        contents: (
          <div>
            This content comes from{' '}
            <a
              href="https://en.wikipedia.org/wiki/Equus_(genus)"
              _target="_blank"
              rel="noopener noreferrer"
            >
              Wikipedia
            </a>{' '}
            under a Creative Commons Share-Alike{' '}
            <a
              href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License"
              _target="_blank"
              rel="noopener noreferrer"
            >
              License
            </a>
            .
          </div>
        )
      }
    ]
  },
  elephantusItem,
  unicornisItem
]

export const nestedItemOverrides = {
  tag: {
    equus: {
      icon: <HorseIcon width="100%" height="2em" />,
      title: 'Equus'
    },
    elephantus: {
      icon: <ElephantIcon width="100%" height="2em" />,
      title: 'Elephantus'
    },
    unicornis: {
      icon: <UnicornIcon width="100%" height="2em" />,
      title: 'Unicornis'
    },
    parent: {
      icon: <MoreIcon width="100%" height="2em" />
    }
  }
}
