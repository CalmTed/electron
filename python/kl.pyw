import time
import sys
from threading import Timer, Thread
from mss import mss # pip install mss
from pynput import mouse,keyboard
# from pynput.mouse import Listener # pip install pynput
# from pynput.keyboard import Listener # pip install pynput
from win32gui import GetWindowText, GetForegroundWindow # pip install pywin32
import copy
import json
# filtering for json titles
import base64
import string

gstatus = 0

class IntervalTimer(Timer):
    def run(self):
        while not self.finished.wait(self.interval):
            self.function(*self.args, **self.kwargs)

class Monitor:
    minKeysNum = 0
    minMouse = 0
    progs = []

    def _updateProg(self, title, type, data):
        isProgExisis = 0
        selectedProgId = -1
        i=0
        for prog in self.progs:
            if prog.title == title:
                isProgExisis = 1
                selectedProgId = i
            i+=1
        if not isProgExisis:
            prog = ProgramInfo(title)
        else:
            prog = self.progs[selectedProgId]
        # duration
        if type == 'duration':
            try:
                prog.duration += 1
            except NameError:
                prog.duration = 1
        # mouse
        if type == 'mouse':
            try:
                prog.mouse += 1
            except NameError:
                prog.mouse = 1
        # keyboard
        if type == 'keys':
            try:
                prog.keyboard += 1
            except NameError:
                prog.keyboard = 1
            # text
            allText = 'a b c d e f g h i j k l m n o p q r s t u v w x y z а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ь ъ э ю я 1 2 3 4 5 6 7 8 9 0 - . , ; : ! ? @ # $ % ^ & * ( ) { } [ ]'.split()
            if str(data)[1:-1] in allText:
                try:
                    prog.text += 1
                except NameError:
                    prog.text = 1
            # spaces
            if data in ['Key.space']:
                try:
                    prog.spaces += 1
                except NameError:
                    prog.spaces = 1
            # enters
            if data in ['Key.enter']:
                try:
                    prog.enters += 1
                except NameError:
                    prog.enters = 1
            # spetialKeys
            if str(data)[0:3] in ['Key']:
                try:
                    prog.spetialKeys += 1
                except NameError:
                    prog.spetialKeys = 1
            # ctrlC
            if str(data) in ["'\\x03'"]:
                try:
                    prog.ctrlC += 1
                except NameError:
                    prog.ctrlC = 1
            # ctrlV
            if str(data) in ["'\\x16'"]:
                try:
                    prog.ctrlV += 1
                except NameError:
                    prog.ctrlV = 1
        if isProgExisis:
            self.progs[selectedProgId] = copy.copy(prog)
        else:
            self.progs.append(copy.copy(prog))
    def _getProgDuration(self):
        if gstatus == 1:
            title = getWinTitle()

            self._updateProg(title,'duration', 1)

    def _on_press(self, k):
        if gstatus == 1:
            self.minKeysNum += 1
            title = getWinTitle()
            self._updateProg(title,'keys', k)
        else:
            checkStatus()

    def _on_click(self,x, y, button, pressed):
        if gstatus == 1:
            self.minMouse += 1
            title = getWinTitle()
            self._updateProg(title,'mouse',button)
        if not pressed:
            # Stop listener
            return False

    def _keylogger(self):
        # mouse does not work now
        # listener = mouse.Listener(on_click=self._on_click)
        # listener.start()
        with keyboard.Listener(on_press=self._on_press) as listener:
            listener.join()

    def _everyminute(self):
        checkStatus()
        if gstatus == 1:
            title = getWinTitle()
            jsUnixTime = round(time.time()*1000)-1000
            jsonStr = ',"{}"'.format(jsUnixTime);
            jsonStr += ':{'
            # date started
            jsonStr += '"started":"{}",'.format(jsUnixTime)
            # keyboard and mouse
            jsonStr += '"keys":"{}",'.format(self.minKeysNum)
            jsonStr += '"mouse":"{}",'.format(self.minMouse)

            jsonStr += '"progs":{'
            for i in range(len(self.progs)):
                jsonStr += '"{}":'.format(i)
                jsonStr += json.dumps(self.progs[i].__dict__)
                if i != len(self.progs)-1:
                    jsonStr += ','

            jsonStr += '}}'
            with open('log', 'a') as f:
                f.write(jsonStr)
            self.progs = []
            self.minKeysNum = 0
            self.minMouse = 0
        # sct = mss()
        # sct.shot(output='./screenshots/{}.png'.format(round(time.time()*1000)))

    def run(self, interval=60):
        Thread(target=self._keylogger).start()
        IntervalTimer(interval, self._everyminute).start()
        IntervalTimer(1, self._getProgDuration).start()

class ProgramInfo:
    title = ''
    duration = 0
    mouse = 0
    keyboard = 0
    text = 0
    spaces = 0
    enters = 0
    spetialKeys = 0
    ctrlC = 0
    ctrlV = 0

    def __init__(self,title):
        self.title = title



def checkStatus():
    with open('workstatus', 'r') as f:
        global gstatus
        status = f.read()
        if status == "onair\n" or status == "onair" :
            if gstatus != 1 :
                gstatus = 1
        else:
            if gstatus != 0 :
                gstatus = 0

checkStatus()

def base64Encode(string):
    message_bytes = string.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('ascii')
    return base64_message

def base64Decode(string):
    base64_bytes = string.encode('ascii')
    message_bytes = base64.b64decode(base64_bytes)
    message = message_bytes.decode('ascii')
    return message

def getWinTitle():
    title = GetWindowText(GetForegroundWindow())
    title = base64Encode(''.join(x for x in title if x in string.printable))
    return title

if __name__ == '__main__':
    mon = Monitor()
    mon.run()
