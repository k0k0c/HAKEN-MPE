loadAPI(1)

host.defineController('Haken', 'Haken Board', '1.0', '8a064e50-b330-11e6-9598-0800200c9a66')
host.defineMidiPorts(1, 1)

function init() {
  host.getMidiInPort(0).setMidiCallback(onMidi)
  noteInput = host.getMidiInPort(0).createNoteInput('',
    '8?????',
    '9?????',
    'B?40??',
    'B?4A??',
    'C?????',
    'D?????',
    'E?????')

  noteInput.setUseExpressiveMidi(true, 0, 48)

  var bendRanges = ['12', '24', '36', '48', '60', '72', '84', '96']
  bendRange = host.getPreferences().getEnumSetting('Bend Range', 'MIDI', bendRanges, '48')
  bendRange.addValueObserver(function (range) {
    var pb = parseInt(range)
    noteInput.setUseExpressiveMidi(true, 0, pb)
    sendPitchBendRangeRPN(1, pb)
  })

  // Set POLY ON mode with 15 MPE voices
  sendChannelController(0, 127, 15)

  // Set up pitch bend sensitivity to 48 semitones
  sendPitchBendRangeRPN(1, 48)

  device = host.createEditorCursorDevice()
}

function sendPitchBendRangeRPN(channel, range) {
  sendChannelController(channel, 100, 0); // Registered Parameter Number (RPN) - LSB*
  sendChannelController(channel, 101, 0); // Registered Parameter Number (RPN) - MSB*
  sendChannelController(channel, 36, 0)
  sendChannelController(channel, 6, range)
}

function sendMacroIfMappedOtherWiseAsMidi(macro, status, data1, data2) {
  noteInput.sendRawMidiEvent(status, data1, data2)
}

function onMidi(status, data1, data2) {
  // printMidi(status, data1, data2)

  if (status == 176) {
    switch (data1) {
      case 107:
        sendMacroIfMappedOtherWiseAsMidi(0, status, data1, data2)
        break
      case 109:
        sendMacroIfMappedOtherWiseAsMidi(1, status, data1, data2)
        break
      case 111:
        sendMacroIfMappedOtherWiseAsMidi(2, status, data1, data2)
        break
      case 113:
        sendMacroIfMappedOtherWiseAsMidi(4, status, data1, data2)
        break
      case 114:
        sendMacroIfMappedOtherWiseAsMidi(5, status, data1, data2)
        break
    }
  }
}

function exit() {
}