<?php

use PHPMailer\PHPMailer\PHPMailer;

require 'vendor/autoload.php';

function IsNullOrEmptyString($str)
{
    return ($str === null || trim($str) === '');
}

if (array_key_exists('form_email', $_POST)) {
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';


    $form_name = 'Nie podano';
    $form_email = null;
    $form_phone = 'Nie podano';
    $form_message = null;
    $form_zgoda = false;

    if (isset($_POST['form_name'])) {
        $form_name = htmlspecialchars($_POST['form_name']);
    }
    if (isset($_POST['form_email'])) {
        $form_email = filter_var($_POST['form_email'], FILTER_SANITIZE_EMAIL);
    }
    if (isset($_POST['form_phone'])) {
        $form_phone = htmlspecialchars($_POST['form_phone']);
    }
    if (isset($_POST['form_message'])) {
        $form_message = htmlspecialchars($_POST['form_message']);
    }
    if (isset($_POST['form_zgoda'])) {
        $form_zgoda = htmlspecialchars($_POST['form_zgoda']);
    }

    if (IsNullOrEmptyString($form_email) || IsNullOrEmptyString($form_message)) {
        die();
    }

    //Server settings
    $mail->isSMTP();
    $mail->Host       = 'smtp.dpoczta.pl';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'formularz@mdon.pl';
    $mail->Password   = '7puW5aNn2Z';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    //Recipients
    $mail->setFrom('formularz@mdon.pl', 'Formularz kontaktowy');
    $mail->addAddress('fundacja@optea.pl');
    $mail->addReplyTo($form_email);
    $mail->addBCC('it@ipracujzdalnie.pl');

    $mail->isHTML(true);
    $mail->Subject = "Wiadomość od $form_name ze strony mdon.pl";

    if ($form_zgoda)
        $zgoda_text = "Tak";
    else
        $zgoda_text = "Nie";

    $mail->Body =
        "<style> td{ border: 1px solid black; } </style>" .
        '<table rules="all" style="border: 1px solid black; width: 80%; margin: auto; table-layout: fixed; border-collapse: collapse;" cellpadding="10">' .
        "<tr style='background: #eee;'><td><strong>Imię i nazwisko:</strong> </td><td>" . $form_name . "</td></tr>" .
        "<tr><td><strong>Adres e-mail:</strong> </td><td>" . $form_email . "</td></tr>" .
        "<tr><td><strong>Numer telefonu:</strong> </td><td>" . $form_phone . "</td></tr>" .
        "<tr><td><strong>Zgoda regulaminowa:</strong> </td><td>" . $zgoda_text . "</td></tr>" .
        '<tr style="text-align:center;"><td colspan="2"><strong>Wiadomość:</strong></td></tr>' .
        '<tr><td colspan="2">' . $form_message . '</td></tr>' .
        "</table>";

    $mail->AltBody = "Imię i nazwisko:\t$form_name\nAdres e-mail:\t$form_email\nNumer telefonu:\t$form_phone\nZgoda regulaminowa:\t$form_zgoda\nWiadomość:\n$form_message";

    $mail->send();
}
