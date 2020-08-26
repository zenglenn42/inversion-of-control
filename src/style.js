export const container = {
  /* border: '1px solid red', */
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  padding: '0 5%',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  backgroundImage: 'linear-gradient(-54deg, blue, #00005a)'
}

export const gutter = {
  /* border: '1px solid purple', */
  visibility: 'hidden',
  flex: 0
}

export const titleBox = {
  /* border: '1px solid green', */
  display: 'flex',
  flexDirection: 'column',
  minHeight: '2em',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1
}

export const title = {
  /* border: '1px solid black', */
  color: 'white'
}

export const contentBox = {
  /* border: '1px solid blue', */
  display: 'flex',
  minWidth: '95%',
  flexDirection: 'row',
  justifyContent: 'space-evenly',
  flex: 5
}

export const content = {
  /* border: '1px solid black' */
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '40%'
}

export const subcontentLeft = {
  display: 'flex',
  justifyContent: 'center',
  minHeight: '60%',
  maxHeight: '60%',
  width: '100%',
  overflow: 'auto scroll',
  backgroundColor: 'white',
  border: '1em solid transparent',
  borderRadius: '.15em',
  background:
    'linear-gradient(white, white) padding-box, url(/images/fixed-borderconst jpg) border-box  0 / cover= ',
  padding: '1em'
}

export const subcontentRight = {
  display: 'flex',
  justifyContent: 'center',
  minHeight: '60%',
  maxHeight: '60%',
  width: '100%',
  overflow: 'auto scroll',
  backgroundColor: 'white',
  border: '1em solid transparent',
  borderRadius: '.15em',
  background:
    'linear-gradient(white, white) padding-box, url(/images/recursive-borderconst jpg) border-box  0 / cover= ',
  padding: '1em'
}
