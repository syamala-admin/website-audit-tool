const HttpsCheck = require('./HttpsCheck');
const ReachabilityCheck = require('./ReachabilityCheck');
const MobileViewportCheck = require('./MobileViewportCheck');
const ImageAltCheck = require('./ImageAltCheck');
const TitleTagCheck = require('./TitleTagCheck');
const MetaDescriptionCheck = require('./MetaDescriptionCheck');
const H1Check = require('./H1Check');
const HeadingStructureCheck = require('./HeadingStructureCheck');
const CanonicalCheck = require('./CanonicalCheck');
const ContactFormCheck = require('./ContactFormCheck');
const TrackingCheck = require('./TrackingCheck');

class CheckFactory {
  /**
   * Creates and returns the full suite of audit checks. Centralizing
   * instantiation here hides check wiring from the rest of the app.
   * @returns {Array<{id: string, category: string, run: Function}>}
   */
  static createChecks() {
    return [
      new ReachabilityCheck(),
      new HttpsCheck(),
      new MobileViewportCheck(),
      new ImageAltCheck(),
      new TitleTagCheck(),
      new MetaDescriptionCheck(),
      new H1Check(),
      new HeadingStructureCheck(),
      new CanonicalCheck(),
      new ContactFormCheck(),
      new TrackingCheck(),
    ];
  }
}

module.exports = CheckFactory;
