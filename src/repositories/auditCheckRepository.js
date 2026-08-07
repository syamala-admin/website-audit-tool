'use strict';

const HttpsCheck = require('../checks/httpsCheck');
const ReachabilityCheck = require('../checks/reachabilityCheck');
const MobileViewportCheck = require('../checks/mobileViewportCheck');
const ImageAltCheck = require('../checks/imageAltCheck');
const TitleCheck = require('../checks/titleCheck');
const MetaDescriptionCheck = require('../checks/metaDescriptionCheck');
const H1Check = require('../checks/h1Check');
const CanonicalCheck = require('../checks/canonicalCheck');
const HeadingStructureCheck = require('../checks/headingStructureCheck');
const FormCheck = require('../checks/formCheck');
const TrackingCheck = require('../checks/trackingCheck');

/**
 * Repository pattern: isolates the set of available audit checks so callers
 * (AuditService) don't need to know how checks are constructed or wired, and
 * checks can be added/removed/swapped independently of the orchestrator.
 */
class AuditCheckRepository {
  constructor() {
    this.checks = [
      new ReachabilityCheck(),
      new HttpsCheck(),
      new MobileViewportCheck(),
      new ImageAltCheck(),
      new TitleCheck(),
      new MetaDescriptionCheck(),
      new H1Check(),
      new CanonicalCheck(),
      new HeadingStructureCheck(),
      new FormCheck(),
      new TrackingCheck(),
    ];
  }

  getAll() {
    return this.checks;
  }
}

module.exports = AuditCheckRepository;
