function createGatewayQuestion(gateway, process) {
  replies = [];

  if (Array.isArray(gateway.outgoing)) {
    gateway.outgoing.forEach(element => {
      var text;
      var id;
      process.sequenceFlow.find(e => {
        if (e.id === element.text) {
          text = e.name;
          id = e.targetRef;
        } else {
          return undefined;
        }
      });
      const reply = {
        title: text !== undefined ? text : "",
        payload: id !== undefined ? id : "",
      };
      replies.push(reply);
    });
  } else {
    replies = [
      {
        title: "Next",
        payload: "next"
      },
      {
        title: "Previous",
        payload: "previous"
      },
      {
        title: "Abort",
        payload: "cancel"
      }
    ];
  }

  const question = {
    text: gateway.name !== "" ? gateway.name : "Please select an option",
    quick_replies: replies
  };

  return question;
}

exports.createGatewayQuestion = createGatewayQuestion;
