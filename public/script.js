$(document).ready(function() {
  $("#shortButton").click(function() {
    // Input elementini seç
    var textInputValue = $("#textInput").val();

    if (textInputValue.startsWith("http://") || textInputValue.startsWith("https://")) {
    fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: textInputValue })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(result => {
      $("#resultModalBody").html('Link Kısaltıldı: <a href="' + result.url + '">' + result.url + '</a>');
      $("#resultModal").modal("show");
    })
    .catch(error => {
      $("#resultModalBody").html('<p>Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin!</p>');
      $("#resultModal").modal("show");
      console.error('There has been a problem with your fetch operation:', error);
    });
    } else {
      $("#resultModalBody").html('<p>Bu bir link değil. Lütfen doğru bir link giriniz.</p>');
      $("#resultModal").modal("show");
    }
  });
});

function api(){
  location.href = "https://luzixus.gitbook.io/linkify-api-docs/";
}