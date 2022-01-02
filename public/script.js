const mainEl = document.querySelector("main");

const data = [];

mainEl.addEventListener("click", function (e) {
  if (e.target.classList.contains("download-button")) {
    const transactionsEl = document.querySelectorAll(".transaction-box");

    if (transactionsEl.length < 1) {
      return;
    }
    const url = window.location.href;
    const chosenDate = url.substring(
      url.indexOf("chosenDate=") + "chosenDate=".length,
      url.length
    );
    console.log(chosenDate);

    transactionsEl.forEach((transaction) => {
      const transactionTitle = transaction.querySelector(
        ".transaction-title a"
      ).innerText;
      const transactionDate = transaction
        .querySelector(".transaction-date")
        .textContent.trim();
      const transactionUrl = transaction.querySelector(
        ".transaction-title a"
      ).href;
      data.push({ transactionTitle, transactionUrl, transactionDate });
    });

    const dataToExport = [
      "Transaction Title,",
      "Transaction Link,",
      "Transaction Date\n",
    ];

    data.map((each) => {
      dataToExport.push(
        (/[,]/.test(each.transactionTitle)
          ? `"${each.transactionTitle}"`
          : each.transactionTitle) + ","
      );
      dataToExport.push(
        (/[",\n]/.test(each.transactionUrl)
          ? `"${each.transactionUrl}"`
          : each.transactionUrl) + ","
      );
      dataToExport.push(each.transactionDate + "\n");
    });

    const csvBlob = new Blob(dataToExport, { type: "text/csv" });
    const blobUrl = URL.createObjectURL(csvBlob);
    const anchorElement = document.createElement("a");

    anchorElement.href = blobUrl;
    anchorElement.download = `M&A Transaction List ${chosenDate}.csv`;
    anchorElement.click();

    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 500);
  }
});
