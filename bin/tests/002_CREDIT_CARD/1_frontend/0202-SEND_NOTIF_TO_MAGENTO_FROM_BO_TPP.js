var paymentType = "HiPay Enterprise Credit Card";

casper.test.begin('Send Notification to Magento from TPP BackOffice via ' + paymentType + ' with ' + typeCC, function (test) {
    phantom.clearCookies();
    var data = "",
        hash = "",
        output = "",
        notif117 = true,
        reload = false,
        orderID = casper.getOrderId(); // Get order ID from previous order or from command line parameter

    /* Open URL to BackOffice HiPay TPP */
    casper.start(baseURL)
        .then(function () {
            this.waitUntilVisible('div.footer', function success() {
                if (this.exists('p[class="bugs"]')) {
                    test.done();
                    this.echo("Test skipped MAGENTO 1.8", "INFO");
                }
            }, function fail() {
                test.assertVisible("div.footer", "'Footer' exists");
            }, 10000);
        })
        .thenOpen(urlBackend, function () {
            this.logToHipayBackend(loginBackend, passBackend);
        })
        .then(function () {
            this.selectAccountBackend("OGONE_DEV");
        })
        .then(function () {
            cartID = casper.getOrderId();
            orderID = casper.getOrderId();
            this.processNotifications(true, false, true, false, "OGONE_DEV");
        })
        /* Open Magento admin panel and access to details of this order */
        .thenOpen(baseURL + "admin/", function () {
            this.logToBackend();
            this.waitForSelector(x('//span[text()="Orders"]'), function success() {
                this.echo("Checking status notifications from Magento server...", "INFO");
                this.click(x('//span[text()="Orders"]'));
                this.waitForSelector(x('//td[contains(., "' + orderID + '")]'), function success() {
                    this.click(x('//td[contains(., "' + orderID + '")]'));
                    this.waitForSelector('div#order_history_block', function success() {
                        /* Check notification with code 116 from Magento server */
                        this.checkNotifMagento("116");
                    }, function fail() {
                        test.assertExists('div#order_history_block', "History block of this order exists");
                    });
                }, function fail() {
                    test.assertExists(x('//td[contains(., "' + orderID + '")]'), "Order # " + orderID + " exists");
                });
            }, function fail() {
                test.assertExists(x('//span[text()="Orders"]'), "Order tab exists");
            });
        })
        /* Idem Notification with code 116 */
        .then(function () {
            this.checkNotifMagento("117");
        })
        /* Idem Notification with code 117 */
        .then(function () {
            this.checkNotifMagento("118");
        })
        .run(function () {
            test.done();
        });
});
