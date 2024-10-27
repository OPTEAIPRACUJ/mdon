<?php

use PHPMailer\PHPMailer\PHPMailer;

require 'vendor/autoload.php';

function IsNullOrEmptyString($str)
{
    return ($str === null || trim($str) === '');
}

if (array_key_exists('reg_form_email', $_POST)) {
    //Create an instance; passing `true` enables exceptions
    $mail = new PHPMailer();
    $mail->CharSet = 'UTF-8';


    $reg_form_name = null;
    $reg_form_people_amount = null;
    $reg_form_type = null;
    $reg_form_organization = 'Osoba prywatna';
    $reg_form_email = null;
    $reg_form_phone = null;
    $reg_form_zgoda = false;

    if (isset($_POST['reg_form_name'])) {
        $reg_form_name = htmlspecialchars($_POST['reg_form_name']);
    }
    if (isset($_POST['reg_form_people_amount'])) {
        $reg_form_people_amount = htmlspecialchars($_POST['reg_form_people_amount']);
    }
    if (isset($_POST['reg_form_type'])) {
        $reg_form_type = htmlspecialchars($_POST['reg_form_type']);
    }
    if (isset($_POST['reg_form_organization']) && $_POST['reg_form_organization'] !== '') {
        $reg_form_organization = htmlspecialchars($_POST['reg_form_organization']);
    }
    if (isset($_POST['reg_form_email'])) {
        $reg_form_email = filter_var($_POST['reg_form_email'], FILTER_SANITIZE_EMAIL);
    }
    if (isset($_POST['reg_form_phone'])) {
        $reg_form_phone = htmlspecialchars($_POST['reg_form_phone']);
    }
    if (isset($_POST['reg_form_zgoda'])) {
        $reg_form_zgoda = htmlspecialchars($_POST['reg_form_zgoda']);
    }

    if (
        IsNullOrEmptyString($reg_form_name) || IsNullOrEmptyString($reg_form_people_amount) || IsNullOrEmptyString($reg_form_type) || IsNullOrEmptyString($reg_form_organization)
        || IsNullOrEmptyString($reg_form_email) || IsNullOrEmptyString($reg_form_phone)
    ) {
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
    $mail->setFrom('formularz@mdon.pl', 'Formularz rejestracyjny');
    $mail->addAddress('fundacja@optea.pl');
    $mail->addReplyTo($reg_form_email);
    $mail->addBCC('it@ipracujzdalnie.pl');

    $mail->isHTML(true);
    $mail->Subject = "Rejestracja na Kongres MDON - $reg_form_name";

    if ($reg_form_zgoda)
        $zgoda_text = "Tak";
    else
        $zgoda_text = "Nie";

    $mail->Body =
        "<style> td{ border: 1px solid black; } </style>" .
        '<table rules="all" style="border: 1px solid black; width: 80%; margin: auto; table-layout: fixed; border-collapse: collapse;" cellpadding="10">' .
        "<tr style='background: #eee;'><td><strong>Imię i nazwisko:</strong> </td><td>" . $reg_form_name . "</td></tr>" .
        "<tr><td><strong>Typ:</strong> </td><td>" . $reg_form_type . "</td></tr>" .
        "<tr><td><strong>Organizacja:</strong> </td><td>" . $reg_form_organization . "</td></tr>" .
        "<tr><td><strong>Liczba osób:</strong> </td><td>" . $reg_form_people_amount . "</td></tr>" .
        "<tr><td><strong>Adres e-mail:</strong> </td><td>" . $reg_form_email . "</td></tr>" .
        "<tr><td><strong>Numer telefonu:</strong> </td><td>" . $reg_form_phone . "</td></tr>" .
        "<tr><td><strong>Zgoda regulaminowa:</strong> </td><td>" . $zgoda_text . "</td></tr>" .
        "</table>";

    $mail->AltBody = "use HTML";

    $mail->send();
}
