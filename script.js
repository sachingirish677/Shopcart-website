    // Catalog information
    const products = ["Product A", "Product B", "Product C"];
    const prices = [20.0, 40.0, 50.0];

    // Discount rules
    const flat10DiscountRule = "flat_10_discount";
    const bulk5DiscountRule = "bulk_5_discount";
    const bulk10DiscountRule = "bulk_10_discount";
    const tiered50DiscountRule = "tiered_50_discount";

    // Fee constants
    const giftWrapFee = 1.0;
    const unitsPerPackage = 10;
    const shippingFeePerPackage = 5.0;

    // Function to calculate the discount amount based on the given rule
    function calculateDiscount(quantity, price, rule) {
      if (rule === bulk5DiscountRule && quantity > 10) {
        return (price * quantity) * 0.05;
      } else if (rule === bulk10DiscountRule && quantity > 20) {
        return (price * quantity) * 0.10;
      } else if (rule === tiered50DiscountRule && quantity > 30 && quantity <= 50) {
        const discountedQuantity = Math.max(quantity - 15, 0);
        return (price * discountedQuantity) * 0.50;
      } else if (rule === flat10DiscountRule && price * quantity > 200) {
        return 10.0;
      }

      return 0.0; // No discount applicable
    }

    // Function to find the best discount rule for a given product quantity and price
    function findBestDiscount(quantity, price) {
      let bestDiscount = "";
      let maxDiscount = 0.0;

      const bulk5Discount = calculateDiscount(quantity, price, bulk5DiscountRule);
      const bulk10Discount = calculateDiscount(quantity, price, bulk10DiscountRule);
      const tiered50Discount = calculateDiscount(quantity, price, tiered50DiscountRule);
      const flat10Discount = calculateDiscount(quantity, price, flat10DiscountRule);

      if (bulk5Discount > maxDiscount) {
        maxDiscount = bulk5Discount;
        bestDiscount = bulk5DiscountRule;
      }
      if (bulk10Discount > maxDiscount) {
        maxDiscount = bulk10Discount;
        bestDiscount = bulk10DiscountRule;
      }
      if (tiered50Discount > maxDiscount) {
        maxDiscount = tiered50Discount;
        bestDiscount = tiered50DiscountRule;
      }
      if (flat10Discount > maxDiscount) {
        maxDiscount = flat10Discount;
        bestDiscount = flat10DiscountRule;
      }

      return bestDiscount;
    }

    function calculateTotal() {
      const quantities = [
        parseInt(document.getElementById("quantity1").value) || 0,
        parseInt(document.getElementById("quantity2").value) || 0,
        parseInt(document.getElementById("quantity3").value) || 0
      ];
      const giftWrap = [
        document.getElementById("giftWrap1").checked,
        document.getElementById("giftWrap2").checked,
        document.getElementById("giftWrap3").checked
      ];

      let subtotal = 0.0;
      let totalDiscount = 0.0;
      let bestDiscount = "";

      for (let i = 0; i < 3; i++) {
        const productTotal = prices[i] * quantities[i];
        const currentBestDiscount = findBestDiscount(quantities[i], prices[i]);
        const discountAmount = calculateDiscount(quantities[i], prices[i], currentBestDiscount);
        const discountedTotal = productTotal - discountAmount;

        if (discountAmount > 0 && discountAmount > totalDiscount) {
          totalDiscount = discountAmount;
          bestDiscount = currentBestDiscount;
        }

        document.getElementById("productOutput" + (i + 1)).textContent = products[i];
        document.getElementById("quantityOutput" + (i + 1)).textContent = quantities[i];
        document.getElementById("discount" + (i + 1)).textContent = discountAmount.toFixed(2);
        document.getElementById("total" + (i + 1)).textContent = discountedTotal.toFixed(2);

        subtotal += discountedTotal;
      }

      const totalQuantity = quantities.reduce((sum, quantity) => sum + quantity, 0);
      const totalPackages = Math.ceil(totalQuantity / unitsPerPackage);
      const shippingFee = totalPackages * shippingFeePerPackage;
      let giftWrapTotal = 0.0;

      for (let i = 0; i < 3; i++) {
        if (giftWrap[i]) {
          giftWrapTotal += quantities[i] * giftWrapFee;
        }
      }

      const grandTotal = subtotal + shippingFee + giftWrapTotal - totalDiscount;

      document.getElementById("subtotal").textContent = subtotal.toFixed(2);
      document.getElementById("discountApplied").textContent = (bestDiscount ? "Discount Applied: " + bestDiscount + " - $" + totalDiscount.toFixed(2) : "");
      document.getElementById("shippingFee").textContent = "$" + shippingFee.toFixed(2) + " (" + totalPackages + " package(s))";
      document.getElementById("giftWrapTotal").textContent = "$" + giftWrapTotal.toFixed(2);
      document.getElementById("grandTotal").textContent = "$" + grandTotal.toFixed(2);

      document.getElementById("output").style.display = "block";
      document.getElementById("output1").style.display = "block";
    }