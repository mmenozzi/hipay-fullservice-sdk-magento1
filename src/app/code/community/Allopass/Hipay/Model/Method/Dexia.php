<?php
class Allopass_Hipay_Model_Method_Dexia extends Allopass_Hipay_Model_Method_Astropay
{	
	protected $_code  = 'hipay_dexia';	
	
	protected $_canRefund               = false;
	protected $_canRefundInvoicePartial = false;
}