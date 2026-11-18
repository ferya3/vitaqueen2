<?php

namespace App\Notifications;

use App\Models\ContactRequest;
use App\Models\Representative;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewLeadReceived extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Representative|ContactRequest $lead)
    {
        $this->afterCommit();
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $lead = $this->lead;
        $admin = rtrim(config('aqua.frontend_url'), '/').'/admin';

        if ($lead instanceof Representative) {
            return (new MailMessage)
                ->subject('درخواست نمایندگی جدید: '.$lead->full_name)
                ->line("نام: {$lead->full_name}")
                ->line("تلفن: {$lead->phone}")
                ->line("استان / شهر: {$lead->province} / {$lead->city}")
                ->line("نوع فعالیت: {$lead->activity_type}")
                ->action('مشاهده در پنل مدیریت', $admin.'/representatives/'.$lead->id);
        }

        return (new MailMessage)
            ->subject('پیام تماس جدید: '.($lead->subject ?: $lead->name))
            ->line("نام: {$lead->name}")
            ->line('تلفن / ایمیل: '.($lead->phone ?: '-').' / '.($lead->email ?: '-'))
            ->line(str($lead->message)->limit(300))
            ->action('مشاهده در پنل مدیریت', $admin.'/contact-requests/'.$lead->id);
    }
}
