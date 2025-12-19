let headers = new Headers({
  "user-agent": "DCJS Fetcher",
});

const dcTriggerMap = {
  load: "load",
  hover: "mouseover",
}

async function renderContentToTarget(content, target) {
  let elementToReplace = document.querySelector("#" + target);
  elementToReplace.innerHTML = content;
}

async function handleDcjs() {
  // need to add a way to show that this is LOADING :-).
  // Look for custom data attributes in DOM.
  let elementsUsingGet = document.querySelectorAll('[dc-get]');
  if (elementsUsingGet.length > 0) {
    const reqUrl = location.protocol + '//' + location.host;
    for (let i = 0; i < elementsUsingGet.length; i++) {
      let dcTrigger = "click";
      let dcjsElem = elementsUsingGet[i];

      if (dcjsElem.hasAttribute('dc-trigger')) {
        dcTrigger = elementsUsingGet[i].getAttribute('dc-trigger');
        dcTrigger = dcTriggerMap[dcTrigger];
      }

      // Dom is already loaded, so just insert content.
      if (dcTrigger == "load") {
        let getPath = dcjsElem.getAttribute('dc-get');
        let targetElement = dcjsElem.getAttribute('dc-target');

        fetch(reqUrl + getPath)
          .then(res => res.text())
          .then(async swap => await renderContentToTarget(swap, targetElement))
      }
      else {
        elementsUsingGet[i].addEventListener(dcTrigger, (e) => {
          let getPath = e.target.getAttribute('dc-get');
          let targetElement = e.target.getAttribute('dc-target');
          fetch(reqUrl + getPath)
            .then(res => res.text())
            .then(async swap => await renderContentToTarget(swap, targetElement))
        })
      }
    }
  }
}
export default {
  handleDcjs,
  renderContentToTarget
};
