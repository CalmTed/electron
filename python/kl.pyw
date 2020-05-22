import time
import os
from threading import Timer, Thread
from mss import mss
from pynput.keyboard import Listener
from win32gui import GetWindowText, GetForegroundWindow

gstatus = 0


class IntervalTimer(Timer):
    def run(self):
        # check js status
        # print(gstatus)
        # if capture screenshots
        while not self.finished.wait(self.interval):
            checkStatus()
            print(gstatus)
            print(gstatus == 1)
            if gstatus == 1:
                self.function(*self.args, **self.kwargs)

class Monitor:
    def _on_press(self, k):
        checkStatus()
        if gstatus == 1:
            with open('log', 'a') as f:
                title = GetWindowText(GetForegroundWindow())
                f.write('{}\t\t{}\n'.format(k, title, time.time()))

    def _keylogger(self):
        with Listener(on_press=self._on_press) as listener:
            listener.join()

    def _screenshot(self):
        sct = mss()
        sct.shot(output='./screenshots/{}.png'.format(time.time()))

    def run(self, interval=60):
        Thread(target=self._keylogger).start()
        IntervalTimer(interval, self._screenshot).start()

def checkStatus():
    with open('workstatus', 'r') as f:
        global gstatus
        status = f.read()
        if status == "onair\n" or status == "onair" :
            if gstatus != 1 :
                gstatus = 1
                print('started capturing')
        else:
            if gstatus != 0 :
                gstatus = 0
                print('stopped capturing')

print(gstatus)
checkStatus()
print(gstatus)
mon = Monitor()
mon.run()
