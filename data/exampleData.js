export var exampleData = {
  init: function() {
    localStorage.clear();
    localStorage.setItem('messages', JSON.stringify([
      {
        id: 'm_1',
        threadID: 't_1',
        threadName: 'Butch and Vincent',
        authorName: 'Butch',
        text: 'You lookin at something, friend?',
        timestamp: Date.now() - 99999
      },
      {
        id: 'm_2',
        threadID: 't_1',
        threadName: 'Butch and Vincent',
        authorName: 'Vincent',
        text: "You ain't my friend, Palooka",
        timestamp: Date.now() - 89999
      },
      {
        id: 'm_3',
        threadID: 't_1',
        threadName: 'Butch and Vincent',
        authorName: 'Butch',
        text: "What's that?",
        timestamp: Date.now() - 79999
      },
      {
        id: 'm_4',
        threadID: 't_2',
        threadName: 'Jules and Vincent',
        authorName: 'Jules',
        text: 'We should have shotguns for this kind of deal. IMHO.',
        timestamp: Date.now() - 69999
      },
      {
        id: 'm_5',
        threadID: 't_2',
        threadName: 'Jules and Vincent',
        authorName: 'Vincent',
        text: 'How many up there?',
        timestamp: Date.now() - 59999
      },
      {
        id: 'm_6',
        threadID: 't_2',
        threadName: 'Jules and Vincent',
        authorName: 'Jules',
        text: 'Three or four.',
        timestamp: Date.now() - 49999
      },
      {
        id: 'm_7',
        threadID: 't_3',
        threadName: 'Vincent and Lance',
        authorName: 'Vincent',
        text: "OMG. Lance! I'm in big fuckin' trouble, man. I'm coming to your house.",
        timestamp: Date.now() - 39999
      },
      {
        id: 'm_8',
        threadID: 't_3',
        threadName: 'Vincent and Lance',
        authorName: 'Lance',
        text: "Whoa. Whoa. Hold your horses, man. What's the problem?",
        timestamp: Date.now() - 29999
      }
    ]));
  }
};
